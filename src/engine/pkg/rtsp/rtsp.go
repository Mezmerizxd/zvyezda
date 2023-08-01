package rtsp

import (
	"crypto/rand"
	"errors"
	"fmt"
	"sync"
	"time"

	"github.com/deepch/vdk/av"
	"github.com/deepch/vdk/format/rtspv2"
)

type ConfigST struct {
	Streams map[string]StreamST `json:"streams"`
}

type StreamST struct {
	URL      string `json:"url"`
	Status   bool   `json:"status"`
	OnDemand bool   `json:"on_demand"`
	RunLock  bool   `json:"-"`
	Codecs   []av.CodecData
	Cl       map[string]viewer
}

type viewer struct {
	c chan av.Packet
}

var (
	ErrorStreamExitNoVideoOnStream = errors.New("Stream Exit No Video On Stream")
	ErrorStreamExitRtspDisconnect  = errors.New("Stream Exit Rtsp Disconnect")
	ErrorStreamExitNoViewer        = errors.New("Stream Exit On Demand No Viewer")
)

var Mutex sync.RWMutex
var Streams map[string]StreamST

func RTSPWorkerLoop(name, url string, OnDemand bool) {
	defer RunUnlock(name)
	for {
		fmt.Println(name, "Stream Try Connect")
		err := RTSPWorker(name, url, OnDemand)
		if err != nil {
			fmt.Println(err)
		}
		if OnDemand && !HasViewer(name) {
			fmt.Println(name, ErrorStreamExitNoViewer)
			return
		}
		time.Sleep(1 * time.Second)
	}
}

func RTSPWorker(name, url string, OnDemand bool) error {
	keyTest := time.NewTimer(20 * time.Second)
	clientTest := time.NewTimer(20 * time.Second)
	RTSPClient, err := rtspv2.Dial(rtspv2.RTSPClientOptions{URL: url, DisableAudio: true, DialTimeout: 3 * time.Second, ReadWriteTimeout: 3 * time.Second, Debug: false})
	if err != nil {
		return err
	}
	defer RTSPClient.Close()
	if RTSPClient.CodecData != nil {
		coAd(name, RTSPClient.CodecData)
	}
	var AudioOnly bool
	if len(RTSPClient.CodecData) == 1 && RTSPClient.CodecData[0].Type().IsAudio() {
		AudioOnly = true
	}

	for {
		select {
		case <-clientTest.C:
			if OnDemand && !HasViewer(name) {
				return ErrorStreamExitNoViewer
			}
		case <-keyTest.C:
			return ErrorStreamExitNoVideoOnStream
		case signals := <-RTSPClient.Signals:
			switch signals {
			case rtspv2.SignalCodecUpdate:
				coAd(name, RTSPClient.CodecData)
			case rtspv2.SignalStreamRTPStop:
				return ErrorStreamExitRtspDisconnect
			}
		case packetAV := <-RTSPClient.OutgoingPacketQueue:
			if AudioOnly || packetAV.IsKeyFrame {
				keyTest.Reset(20 * time.Second)
			}
			cast(name, *packetAV)
		}
	}
}

func RunIfNotRun(uuid string) {
	Mutex.Lock()
	defer Mutex.Unlock()
	if tmp, ok := Streams[uuid]; ok {
		if tmp.OnDemand && !tmp.RunLock {
			tmp.RunLock = true
			Streams[uuid] = tmp
			go RTSPWorkerLoop(uuid, tmp.URL, tmp.OnDemand)
		}
	}
}

func RunUnlock(uuid string) {
	Mutex.Lock()
	defer Mutex.Unlock()
	if tmp, ok := Streams[uuid]; ok {
		if tmp.OnDemand && tmp.RunLock {
			tmp.RunLock = false
			Streams[uuid] = tmp
		}
	}
}

func HasViewer(uuid string) bool {
	Mutex.Lock()
	defer Mutex.Unlock()
	if tmp, ok := Streams[uuid]; ok && len(tmp.Cl) > 0 {
		return true
	}
	return false
}

func cast(uuid string, pck av.Packet) {
	Mutex.Lock()
	defer Mutex.Unlock()
	for _, v := range Streams[uuid].Cl {
		if len(v.c) < cap(v.c) {
			v.c <- pck
		}
	}
}

func ext(suuid string) bool {
	Mutex.Lock()
	defer Mutex.Unlock()
	_, ok := Streams[suuid]
	return ok
}

func coAd(suuid string, codecs []av.CodecData) {
	Mutex.Lock()
	defer Mutex.Unlock()
	t := Streams[suuid]
	t.Codecs = codecs
	Streams[suuid] = t
}

func coGe(suuid string) []av.CodecData {
	for i := 0; i < 100; i++ {
		Mutex.RLock()
		tmp, ok := Streams[suuid]
		Mutex.RUnlock()
		if !ok {
			return nil
		}
		if tmp.Codecs != nil {
			return tmp.Codecs
		}
		time.Sleep(50 * time.Millisecond)
	}
	return nil
}

func clAd(suuid string) (string, chan av.Packet) {
	Mutex.Lock()
	defer Mutex.Unlock()
	cuuid := pseudoUUID()
	ch := make(chan av.Packet, 100)
	Streams[suuid].Cl[cuuid] = viewer{c: ch}
	return cuuid, ch
}

func list() (string, []string) {
	Mutex.Lock()
	defer Mutex.Unlock()
	var res []string
	var fist string
	for k := range Streams {
		if fist == "" {
			fist = k
		}
		res = append(res, k)
	}
	return fist, res
}

func clDe(suuid, cuuid string) {
	Mutex.Lock()
	defer Mutex.Unlock()
	delete(Streams[suuid].Cl, cuuid)
}

func pseudoUUID() (uuid string) {
	b := make([]byte, 16)
	_, err := rand.Read(b)
	if err != nil {
		fmt.Println("Error: ", err)
		return
	}
	uuid = fmt.Sprintf("%X-%X-%X-%X-%X", b[0:4], b[4:6], b[6:8], b[8:10], b[10:])
	return
}