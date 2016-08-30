import React from 'react';
import moment from 'moment';
import RcTimePicker from 'rc-time-picker/lib/TimePicker';
import classNames from 'classnames';
import assign from 'object-assign';
import defaultLocale from './locale/zh_CN';

// TimePicker
export interface TimePickerProps {
  className?: string;
  size?: 'large' | 'default' | 'small';
  /** 默认时间 */
  value?: string | Date;
  /** 初始默认时间 */
  defaultValue?: string | Date;
  /** 展示的时间格式 : "HH:mm:ss"、"HH:mm"、"mm:ss" */
  format?: string;
  /** 时间发生变化的回调 */
  onChange?: (time: Date, timeString: string) => void;
  /** 禁用全部操作 */
  disabled?: boolean;
  /** 没有值的时候显示的内容 */
  placeholder?: string;
  /** 隐藏禁止选择的选项 */
  hideDisabledOptions?: boolean;
  /** 禁止选择部分小时选项 */
  disabledHours?: Function;
  /** 禁止选择部分分钟选项 */
  disabledMinutes?: Function;
  /** 禁止选择部分秒选项 */
  disabledSeconds?: Function;

  style?: React.CSSProperties;
}

export interface TimePickerContext {
  antLocale?: {
    TimePicker?: any,
  };
}

export default class TimePicker extends React.Component<TimePickerProps, any> {
  static defaultProps = {
    format: 'HH:mm:ss',
    prefixCls: 'ant-time-picker',
    onChange() {
    },
    align: {
      offset: [0, -2],
    },
    disabled: false,
    disabledHours: undefined,
    disabledMinutes: undefined,
    disabledSeconds: undefined,
    hideDisabledOptions: false,
    placement: 'bottomLeft',
    transitionName: 'slide-up',
  };

  static contextTypes = {
    antLocale: React.PropTypes.object,
  };

  context: TimePickerContext;

  constructor(props) {
    super(props);

    this.state = {
      value: this.parseTimeFromValue(props.value) || this.parseTimeFromValue(props.defaultValue),
    };
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({ value: this.parseTimeFromValue(nextProps.value) });
    }
  }

  /**
   * 获得输入框的默认值
   */
  parseTimeFromValue(value) {
    if (value) {
      if (typeof value === 'string') {
        return moment(value, this.props.format);
      } else if (value instanceof Date) {
        return moment(value);
      }
    }
    return value;
  }

  handleChange = (value: moment.Moment) => {
    const { onChange, format } = this.props;
    if (!('value' in this.props)) {
      this.setState({ value });
    }
    onChange(
      value ? value.toDate() : null,
      value ? value.format(format) : ''
    );
  }

  getLocale() {
    const antLocale = this.context.antLocale;
    const timePickerLocale = (antLocale && antLocale.TimePicker) || defaultLocale;
    return timePickerLocale;
  }

  render() {
    const props = assign({}, this.props);
    delete props.defaultValue;

    const className = classNames({
      [props.className]: !!props.className,
      [`${props.prefixCls}-${props.size}`]: !!props.size,
    });

    return (
      <RcTimePicker
        {...props}
        className={className}
        value={this.state.value}
        placeholder={props.placeholder || this.getLocale().placeholder}
        showHour={props.format.indexOf('HH') > -1}
        showSecond={props.format.indexOf('ss') > -1}
        onChange={this.handleChange}
      />
    );
  }
}
