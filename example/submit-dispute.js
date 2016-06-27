// Require Chargehound and create an instance
const chargehound = require('../lib')(process.env.CHARGEHOUND_API_KEY)

// List currently active disputes and then submit the most recent with the 'crowdfunding'
// template and update the `customer_ip` evidence field.
chargehound.Disputes.list()
  .then(function (res) {
    const first = res.data[0]
    console.log(`First dispute id: ${first.id}`)
    return chargehound.Disputes.submit(first.id, {
      template: 'crowdfunding',
      fields: { 'customer_ip': '0.0.0.0' },
      products: [{
        name: 'Product Name 1',
        description: 'Product Description (optional)',
        image: 'Product Image URL (optional)',
        sku: 'Stock Keeping Unit (optional)',
        quantity: 1,
        amount: 1000,
        url: 'Product URL (optional)'
      }, {
        name: 'Product Name 2',
        description: 'Product Description (optional)',
        image: 'Product Image URL (optional)',
        sku: 'Stock Keeping Unit (optional)',
        quantity: '10oz',
        amount: 2000,
        url: 'Product URL (optional)'
      }]
    })
  })
  .then(function (res) {
    console.log(`Submitted with fields: ${JSON.stringify(res.fields, null, 2)}`)
  })
