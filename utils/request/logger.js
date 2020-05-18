const logBuffer = [];
const logColors = {
  request: '#03A9F4',
  response: '#4CAF50',
  error: '#F20404',
};

export const repeat = (str, times) => (new Array(times + 1)).join(str);

export const pad = (num, maxLength) => repeat('0', maxLength - num.toString().length) + num;

const formatTime = (time) => `${pad(time.getHours(), 2)}:${pad(time.getMinutes(), 2)}:${pad(time.getSeconds(), 2)}.${pad(time.getMilliseconds(), 3)}`;

function printBuffer() {
  logBuffer.forEach((logEntry) => {
    // exit if console undefined
    if (typeof console === 'undefined') {
      return;
    }

    const { method, url, data, started, took, resp, error } = logEntry;
    const formattedTime = formatTime(new Date(started));

    const title = `${method} ${url} ${`@ ${formattedTime}`} ${`(in ${took.toFixed(2)} ms)`}`;
    try {
      console.groupCollapsed(title);
    } catch (e) {
      console.log(title);
    }

    const requestBody = typeof data === 'object' ? { ...data } : data;
    console.info(
      '%c request',
      `font-weight: bold; color: ${logColors.request}`,
      requestBody,
    );

    if (error) {
      console.info(
        '%c error',
        `font-weight: bold; color: ${logColors.error}`,
        error,
      );
    }

    if (resp) {
      console.info(
        '%c response',
        `font-weight: bold; color: ${logColors.response}`,
        resp,
      );
    }

    try {
      console.groupEnd();
    } catch (e) {
      console.log('—— log end ——');
    }
  });

  logBuffer.length = 0;
}
export default {
  logBuffer,
  printBuffer
}