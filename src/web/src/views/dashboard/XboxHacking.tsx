import { Context } from './styled';
import { StandardContext, StandardContextHeader, StandardContextBody } from '../../components/contexts/StandardContext';

export default () => {
  return (
    <Context>
      <StandardContext>
        <StandardContextHeader>
          <h1>Xbox Hacking</h1>
        </StandardContextHeader>
        <StandardContextBody>
          <h1>Coming soon!</h1>
        </StandardContextBody>
      </StandardContext>
    </Context>
  );
};
