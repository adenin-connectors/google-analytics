'use strict';
const api = require('./common/api');

module.exports = async (activity) => {
  var dateRange = Activity.dateRange("today");
  let start = dateRange.startDate.split('T')[0]; //get just date (yyyy-mm-dd)
  let end = dateRange.endDate.split('T')[0]; //get just date (yyyy-mm-dd)

  const response = await api(`/analytics/v3/data/ga?metrics=ga:users,ga:sessions&start-date=${start}&end-date=${end}`);
  if (Activity.isErrorResponse(response)) return;

  let visitorsCount = response.body.totalsForAllResults['ga:users'];
  let visitsCount = response.body.totalsForAllResults['ga:sessions'];

  try {
    Activity.Response.Data = {
      title: T('Traffic By Date'),
      link: 'https://analytics.google.com/analytics/web/',
      linkLabel: T('All Traffic Data'),
      chart: {
        configuration: {
          data: {
            labels: [T('Site Data')],
            datasets: [
              {
                label: T("Visitors"),
                data: [visitorsCount]
              },
              {
                label: T("Visits"),
                data: [visitsCount]
              }
            ]
          },
          options: {
            title: {
              display: true,
              text: T('Site Visits Data')
            }
          }
        },
        template: 'bar',
        palette: 'office.Office6'
      }
    };
  } catch (error) {
    Activity.handleError(activity);
  }
};
