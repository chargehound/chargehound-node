'use strict'

const ApiRequestor = require('../api-requestor')

module.exports = class Disputes {
  constructor (chargehound) {
    this._requestor = new ApiRequestor(chargehound)
  }

  /**
   * Create a dispute
   * This endpoint will return a single dispute.
   * @param {Object} [disputeCreate] A dispute create object
   * @param {function} [callback] the callback function
   * @return Dispute
   */
  create (disputeCreate) {
    return this._requestor.request({
      method: 'POST',
      path: 'disputes',
      data: disputeCreate
    }, this._requestor.getCallback(arguments))
  }

  /**
   * Retrieve a dispute
   * This endpoint will return a single dispute.
   * @param {String}  disputeId A dispute id
   * @param {function} [callback] the callback function
   * @return Dispute
   */
  retrieve (id) {
    return this._requestor.request({
      method: 'GET',
      path: `disputes/${id}`
    }, this._requestor.getCallback(arguments))
  }

  /**
   * Retrieve the response for a dispute once it is available
   * @param {String}  disputeId A dispute id
   * @param {function} [callback] the callback function
   * @return Dispute
   */
  response (id) {
    return this._requestor.request({
      method: 'GET',
      path: `disputes/${id}/response`
    }, this._requestor.getCallback(arguments))
  }

  /**
   * A list of disputes
   * This endpoint will list all the disputes that we have synced from Stripe. By default the disputes will be ordered by `created` with the most recent dispute first. `has_more` will be `true` if more results are available.
   * @param {Object} [listParams] Query parameters for the list of disputes.
   * @param {function} [callback] the callback function
   * @return Disputes
   */
  list (query) {
    return this._requestor.request({
      method: 'GET',
      path: 'disputes',
      query
    }, this._requestor.getCallback(arguments))
  }

  /**
   * Submitting a dispute
   * You will want to submit the dispute through Chargehound after you recieve a notification from Stripe of a new dispute. With one `POST` request you can update a dispute with the evidence fields and send the generated response to Stripe. The response will have a `201` status if the submit was successful. The dispute will also be in the submitted state.
   * @param {String}  disputeId A dispute id
   * @param {Object} [disputeUpdate]  disputeUpdate A dispute update object
   * @param {function} [callback] the callback function
   * @return Dispute
   */
  submit (id, disputeUpdate) {
    return this._requestor.request({
      method: 'POST',
      path: `disputes/${id}/submit`,
      data: disputeUpdate
    }, this._requestor.getCallback(arguments))
  }

  /**
   * Updating a dispute
   * You can update the template and the fields on a dispute.
   * @param {String}  disputeId A dispute id
   * @param {Object} [disputeUpdate]  disputeUpdate A dispute update object
   * @param {function} [callback] the callback function
   * @return Dispute
   */
  update (id, disputeUpdate) {
    return this._requestor.request({
      method: 'PUT',
      path: `disputes/${id}`,
      data: disputeUpdate
    }, this._requestor.getCallback(arguments))
  }
}
