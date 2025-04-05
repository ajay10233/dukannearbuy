'use client'

import { useState } from 'react'

export default function CreateBillPage() {
  const [useFileUpload, setUseFileUpload] = useState(false)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const [form, setForm] = useState({
    userId: '',
    tokenId: '',
    name: '',
    phoneNumber: '',
    remarks: '',
    invoiceNumber: '',
    otherCharges: '',
    generateShortBill: true,
    items: [{ name: '', price: 0, quantity: 1 }],
  })

  const handleItemChange = (index, field, value) => {
    const newItems = [...form.items]
    newItems[index][field] =
      field === 'price' || field === 'quantity' ? parseFloat(value) || 0 : value
    setForm({ ...form, items: newItems })
  }

  const addItem = () => {
    setForm({ ...form, items: [...form.items, { name: '', price: 0, quantity: 1 }] })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      let res

      if (useFileUpload) {
        if (!file) {
          alert('Please select a file.')
          setLoading(false)
          return
        }

        const body = new FormData()
        body.append('userId', form.userId)
        body.append('tokenId', form.tokenId)
        body.append('remarks', form.remarks)
        body.append('invoiceNumber', form.invoiceNumber)
        body.append('file', file)

        res = await fetch('/api/bill', {
          method: 'POST',
          body,
          // DO NOT set Content-Type when using FormData
        })
      } else {
        const payload = {
          ...form,
          otherCharges:
            form.otherCharges === ''
              ? 0
              : isNaN(Number(form.otherCharges))
              ? -1
              : parseFloat(form.otherCharges),
        }

        res = await fetch('/api/bill', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })
      }

      const data = await res.json()
      setResult(data)
    } catch (err) {
      console.error(err)
      setResult({ success: false, error: 'Something went wrong' })
    }

    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Bill</h1>

      <label className="flex items-center mb-4 space-x-2">
        <input
          type="checkbox"
          checked={useFileUpload}
          onChange={() => setUseFileUpload(!useFileUpload)}
        />
        <span>Upload PDF/Image Instead</span>
      </label>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border rounded p-2"
          placeholder="User ID"
          value={form.userId}
          onChange={(e) => setForm({ ...form, userId: e.target.value })}
        />
        <input
          className="w-full border rounded p-2"
          placeholder="Token ID"
          value={form.tokenId}
          onChange={(e) => setForm({ ...form, tokenId: e.target.value })}
        />
        <input
          className="w-full border rounded p-2"
          placeholder="Invoice Number"
          value={form.invoiceNumber}
          onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })}
        />
        <textarea
          className="w-full border rounded p-2"
          placeholder="Remarks"
          value={form.remarks}
          onChange={(e) => setForm({ ...form, remarks: e.target.value })}
        />

        {useFileUpload ? (
          <div>
            <input
              type="file"
              accept="application/pdf,image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full border rounded p-2"
            />
          </div>
        ) : (
          <>
            <input
              className="w-full border rounded p-2"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="w-full border rounded p-2"
              placeholder="Phone Number"
              value={form.phoneNumber}
              onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
            />
            <input
              className="w-full border rounded p-2"
              placeholder="Other Charges"
              value={form.otherCharges}
              onChange={(e) => setForm({ ...form, otherCharges: e.target.value })}
            />

            <div className="space-y-2">
              <h2 className="font-semibold">Items</h2>
              {form.items.map((item, index) => (
                <div key={index} className="grid grid-cols-3 gap-2">
                  <input
                    className="border p-2"
                    placeholder="Item Name"
                    value={item.name}
                    onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                  />
                  <input
                    className="border p-2"
                    placeholder="Price"
                    type="number"
                    value={item.price}
                    onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                  />
                  <input
                    className="border p-2"
                    placeholder="Quantity"
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addItem}
                className="text-blue-600 underline mt-1"
              >
                + Add another item
              </button>
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? 'Creating...' : 'Create Bill'}
        </button>
      </form>

      {result && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          {result.success ? (
            <>
              <p className="text-green-600 font-semibold">Bill created successfully!</p>
              <pre className="text-sm">{JSON.stringify(result.bill, null, 2)}</pre>
              {result.shortBill && (
                <>
                  <p className="mt-2 text-sm text-gray-600">ShortBill:</p>
                  <pre className="text-sm">{JSON.stringify(result.shortBill, null, 2)}</pre>
                </>
              )}
            </>
          ) : (
            <p className="text-red-600">Error: {result.error}</p>
          )}
        </div>
      )}
    </div>
  )
}
