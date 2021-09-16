import { InputState } from '../components/form/samisk-samtale-order-form/SamiskSamtaleOrderForm';

export const objectToQueryString = (params?: object, firstChar = '?') =>
    params
        ? Object.entries(params).reduce(
              (acc, [k, v], i) =>
                  v !== undefined
                      ? `${acc}${i ? '&' : firstChar}${k}=${encodeURIComponent(
                            typeof v === 'object' ? JSON.stringify(v) : v
                        )}`
                      : acc,
              ''
          )
        : '';

const submitUrl = `${process.env.APP_ORIGIN}${process.env.APP_BASEPATH}/api/submit`;

export const fetchFormSubmit = async (input: InputState) =>
    fetch(`${submitUrl}${objectToQueryString(input)}`);
