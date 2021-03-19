import React from 'react';
import { Icon } from '@gqlapp/look-client-react';

interface VerificationIconComponentProps {
  vStatus: boolean;
}

const VerificationIconComponent: React.FunctionComponent<VerificationIconComponentProps> = props => {
  if (!props.vStatus) {
    return <Icon type="CheckCircleTwoTone" twoToneColor="#ff0000" />;
  } else {
    return <Icon type="CloseCircleTwoTone" twoToneColor="#52c41a" />;
  }
};

export default VerificationIconComponent;
