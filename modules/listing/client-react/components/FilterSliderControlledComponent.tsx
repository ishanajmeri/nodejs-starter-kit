import React from 'react';
import { Slider, FormItem, Space, Icon } from '@gqlapp/look-client-react';

interface SliderControlledProps {
  handleSliderChange: (value: number[]) => void;
  value: number[];
  icon?: string;
  inFilter: boolean;
  label: string;
  style: object;
  max: number;
  min: number;
  range: boolean;
  marks: { [x: string]: number };
}

const FilterSliderControlledComponent: React.FunctionComponent<SliderControlledProps> = props => {
  const [value, setValue] = React.useState(props.value);
  React.useEffect(() => {
    setValue(props.value);
  }, [props.value]);
  const { icon, ...currentProps } = props;
  const handleChange = (e: number[]) => {
    setValue(e);
  };
  const handleSubmit = (e: number[]) => {
    const { handleSliderChange } = props;
    setTimeout(() => {
      handleSliderChange(e);
    }, 500);
  };
  delete currentProps.value;
  delete currentProps.handleSliderChange;
  const labels = currentProps.inFilter
    ? {}
    : {
        labelCol: { span: 24 },
        wrapperCol: { span: 24 }
      };
  return (
    <FormItem
      label={
        <Space align="center">
          {icon ? <Icon type={icon} /> : <>&#8377;</>}
          {currentProps.label}
        </Space>
      }
      style={{ height: '60px', width: '100%' }}
      {...labels}
    >
      <Slider
        {...props}
        value={value}
        onChange={(e: number[]) => handleChange(e)}
        onAfterChange={(e: number[]) => handleSubmit(e)}
      />
    </FormItem>
  );
};

export default FilterSliderControlledComponent;
