import { notification } from 'antd';

export default function Toast(
  title,
  content,
  status,
  placement = 'bottomRight'
) {
  switch (status) {
    case 'success':
      notification.success({
        message: title,
        description: content,
        placement: placement,
      });
      break;

    case 'warning':
      notification.warning({
        message: title,
        description: content,
        placement: placement,
      });
      break;

    case 'error':
      notification.error({
        message: title,
        description: content,
        placement: placement,
      });
      break;

    default:
      notification.info({
        message: title,
        description: content,
        placement: placement,
      });
  }
}
