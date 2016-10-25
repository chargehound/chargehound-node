'use strict'

const ApiRequestor = require('../api-requestor')

module.exports = class Disputes {
  constructor (chargehound) {
    this._chargehound = chargehound
  }

  /**
   * Create a dispute
   * This endpoint will return a single dispute.
   * @param {Object} [disputeCreate] A dispute create object
   * @param {Object} [query] Query params
   * @param {function} [callback] the callback function
   * @return Dispute
   */
  create (disputeCreate, query) {
    const requestor = new ApiRequestor(this._chargehound)
    return requestor.request({
      method: 'POST',
      path: 'disputes',
      data: disputeCreate,
      query
    }, requestor.getCallback(arguments))
  }

  /**
   * Retrieve a dispute
   * This endpoint will return a single dispute.
   * @param {String}  disputeId A dispute id
   * @param {function} [callback] the callback function
   * @return Dispute
   */
  retrieve (id) {
    const requestor = new ApiRequestor(this._chargehound)
    return requestor.request({
      method: 'GET',
      path: `disputes/${id}`
    }, requestor.getCallback(arguments))
  }

  /**
   * A list of disputes
   * This endpoint will list all the disputes that we have synced from Stripe. By default the disputes will be ordered by `created` with the most recent dispute first. `has_more` will be `true` if more results are available.
   * @param {Object} [listParams] Query parameters for the list of disputes.
   * @param {Number} [listParams.limit] Maximum number of disputes to return. Default is 20, maximum is 100.
   * @param {String} [listParams.starting_after] A dispute id. Fetch disputes created after this dispute.
   * @param {String} [listParams.ending_before] A dispute id. Fetch disputes created before this dispute.
   * @param {function} [callback] the callback function
   * @return Disputes
   */
  list (listParams) {
    const requestor = new ApiRequestor(this._chargehound)
    return requestor.request({
      method: 'GET',
      path: 'disputes',
      query: listParams
    }, requestor.getCallback(arguments))
  }

  /**
   * Submitting a dispute
   * You will want to submit the dispute through Chargehound after you recieve a notification from Stripe of a new dispute. With one `POST` request you can update a dispute with the evidence fields and send the generated response to Stripe. The response will have a `201` status if the submit was successful. The dispute will also be in the submitted state.
   * @param {String}  disputeId A dispute id
   * @param {Object} [disputeUpdate]  disputeUpdate A dispute update object
   * @param {String} [disputeUpdate.template] The id of the template to use.
   * @param {Object} [disputeUpdate.fields] Key value pairs to hydrate the template's evidence fields.
   * @param {Object} [disputeUpdate.products] List of products the customer purchased.
   * @param {function} [callback] the callback function
   * @return Dispute
   */
  submit (id, disputeUpdate) {
    const requestor = new ApiRequestor(this._chargehound)
    return requestor.request({
      method: 'POST',
      path: `disputes/${id}/submit`,
      data: disputeUpdate
    }, requestor.getCallback(arguments))
  }

  /**
   * Updating a dispute
   * You can update the template and the fields on a dispute.
   * @param {String}  disputeId A dispute id
   * @param {Object} [disputeUpdate]  disputeUpdate A dispute update object
   * @param {String} [disputeUpdate.template] The id of the template to use.
   * @param {Object} [disputeUpdate.fields] Key value pairs to hydrate the template's evidence fields.
   * @param {Object} [disputeUpdate.products] List of products the customer purchased.
   * @param {function} [callback] the callback function
   * @return Dispute
   */
  update (id, disputeUpdate) {
    const requestor = new ApiRequestor(this._chargehound)
    return requestor.request({
      method: 'PUT',
      path: `disputes/${id}`,
      data: disputeUpdate
    }, requestor.getCallback(arguments))
  }
}
