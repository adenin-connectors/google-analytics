'use strict';
const api = require('./common/api');

module.exports = async (activity) => {
  try {

    var dateRange = $.dateRange(activity, "today");
    let start = dateRange.startDate.split('T')[0]; //get just date (yyyy-mm-dd)
    let end = dateRange.endDate.split('T')[0]; //get just date (yyyy-mm-dd)

    api.initialize(activity);
    const response = await api(`/analytics/v3/data/ga?metrics=ga:users&start-date=${start}&end-date=${end}`);

    if ($.isErrorResponse(activity, response)) return;

    let visitStatus = {
      title: T(activity, 'Total Visitors'),
      linkl: 'https://analytics.google.com/analytics/web/',
      linkLabel: T(activity, 'All Visitors'),
    };

    let visitCount = response.body.totalsForAllResults['ga:users'];

    if (visitCount != 0) {
      visitStatus = {
        ...visitStatus,
        description: visitCount > 1 ? T(activity, `You have total of {0} visitors.`, visitCount)
          : T(activity, `You have total of 1 visitor.`),
        color: 'blue',
        value: response.body.length,
        actionable: true
      };
    } else {
      visitStatus = {
        ...visitStatus,
        description: T(activity, `You have no visitors.`),
        actionable: false
      };
    }

    activity.Response.Data = visitStatus;
  } catch (error) {
    $.handleError(activity, error);
  }
};