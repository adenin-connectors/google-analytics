'use strict';
const api = require('./common/api');

module.exports = async (activity) => {
  var dateRange = $.dateRange(activity);
  let start = dateRange.startDate.split('T')[0]; //get just date (yyyy-mm-dd)
  let end = dateRange.endDate.split('T')[0]; //get just date (yyyy-mm-dd)

  api.initialize(activity);
  const response = await api(`/analytics/v3/data/ga?metrics=ga:users,ga:sessions&start-date=${start}&end-date=${end}`);
  if ($.isErrorResponse(activity, response)) return;

  let visitorsCount = response.body.totalsForAllResults['ga:users'];
  let visitsCount = response.body.totalsForAllResults['ga:sessions'];

  try {
    activity.Response.Data = {
      title: T('Traffic By Date'),
      link: 'https://analytics.google.com/analytics/web/',
      linkLabel: T(activity, 'All Traffic Data'),
      chart: {
        configuration: {
          data: {
            labels: [T(activity, 'Site Data')],
            datasets: [
              {
                label: T(activity, "Visitors"),
                data: [visitorsCount]
              },
              {
                label: T(activity, "Visits"),
                data: [visitsCount]
              }
            ]
          },
          options: {
            title: {
              display: true,
              text: T(activity, 'Site Visits Data')
            }
          }
        },
        template: 'bar',
        palette: 'office.Office6'
      }
    };
  } catch (error) {
    $.handleError(activity, error);
  }
};
