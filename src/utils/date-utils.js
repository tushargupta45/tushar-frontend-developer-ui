import moment from "moment";

export const formatDate = (
  date,
  resultFormat = "DD MMM YYYY",
  defaultValue = "- - -"
) => {
  if (moment(date).isValid()) {
    return moment(date).parseZone().format(resultFormat);
  }
  return defaultValue;
};
