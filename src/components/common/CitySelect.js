import React from 'react';
import { Select, Button } from 'antd';
import classNames from 'classnames';
const Option = Select.Option;

import { province as provinceData, city as cityData } from 'components/data/province';

export default class CitySelect extends React.Component {

  constructor(props) {
    super(props);
    const defaultProvince = provinceData[0];
    this.state = {
      selectProvince: false,
      selectCity: false,
      isSaveCity: false,
      province: defaultProvince,
      city: ''
    };
  }

  static defaultProps = {
    onSelect: () => {},
  }

  onFormChange(field, value) {
    switch (field) {
    case 'province':
      this.setState({
        selectCity: true,
        isSaveCity: true,
        province: value,
        city: cityData[value][0]
      });
      break;
    case 'city':
      this.setState({
        city: value
      });
      break;
    case 'save':
      this.setState({
        selectProvince: false,
        selectCity: false,
        isSaveCity: false
      });
      this.props.onSelect(this.state.city);
      break;
    default:
      this.setState({
        selectProvince: false,
        selectCity: false
      });
    }
  }

  render() {
    let { selectProvince, selectCity, isSaveCity, province, city } = this.state;
    const cities = cityData[province];
    const cityOptions = cities.map(item => <Option key={item}>{item}</Option>);
    const provinceOptions = provinceData.map(item => <Option key={item}>{item}</Option>);
    return (
      <div className="test-city">
        <span className="city-switch" onClick={() => this.setState({ selectProvince: true })}>
          {'{ 切换 }'}
        </span>
        { selectProvince && <div className="city-select">
          <Select
            style={{width: 90}}
            placeholder="选择省"
            className={classNames(selectCity && 'province-selected')}
            onChange={(province) => this.onFormChange('province', province)}
          >
            {provinceOptions}
          </Select>
          { selectCity &&<Select
              style={{width: 90}}
              placeholder="选择市"
              value={city}
              onChange={(city) => this.onFormChange('city', city)}
            >
            {cityOptions}
          </Select>}
          <Button type="primary" onClick={() => {
            if (isSaveCity) {
              this.onFormChange('save');
            }else{
              this.onFormChange('cancle');
            }
          }}>{isSaveCity ? '保存' : '取消'}</Button>
        </div>}
      </div>
    );
  }
}
