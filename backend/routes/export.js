const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Item = require('../models/Item');
const SwapRequest = require('../models/SwapRequest');

function toCsv(rows, headers) {
  const escape = (v) => {
    const s = v === null || v === undefined ? '' : String(v);
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const lines = [];
  lines.push(headers.map(escape).join(','));
  for (const r of rows) {
    lines.push(headers.map((h) => escape(r[h])).join(','));
  }
  return lines.join('\n');
}

router.get('/inventory', auth, async (req, res) => {
  const format = (req.query.format || 'csv').toLowerCase();
  const scope = (req.query.scope || 'private').toLowerCase(); // private|all
  try {
    const filter = { ownerId: req.user.id };
    if (scope === 'private') filter.availability = 'Private Collection';

    const items = await Item.find(filter).sort({ createdAt: -1 });
    const rows = items.map((it) => ({
      title: it.title,
      category: it.category,
      condition: it.condition,
      availability: it.availability,
      location: it.location || '',
      tags: Array.isArray(it.tags) ? it.tags.join('|') : '',
      createdAt: it.createdAt ? new Date(it.createdAt).toISOString() : ''
    }));

    if (format === 'csv') {
      const csv = toCsv(rows, ['title', 'category', 'condition', 'availability', 'location', 'tags', 'createdAt']);
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="swapsphere-inventory-${scope}.csv"`);
      return res.send(csv);
    }

    if (format === 'pdf') {
      const PDFDocument = require('pdfkit');
      const doc = new PDFDocument({ margin: 40 });
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="swapsphere-inventory-${scope}.pdf"`);
      doc.pipe(res);

      doc.fontSize(18).text('SwapSphere Inventory Export', { align: 'left' });
      doc.moveDown(0.5);
      doc.fontSize(10).fillColor('#444').text(`Scope: ${scope} • Exported: ${new Date().toLocaleString()}`);
      doc.moveDown();
      doc.fillColor('#000');

      if (rows.length === 0) {
        doc.text('No items found.');
      } else {
        rows.forEach((r, idx) => {
          doc.fontSize(12).text(`${idx + 1}. ${r.title}`);
          doc.fontSize(10).fillColor('#444').text(
            `Category: ${r.category} • Condition: ${r.condition} • Availability: ${r.availability}`
          );
          if (r.tags) doc.text(`Tags: ${r.tags.split('|').join(', ')}`);
          if (r.location) doc.text(`Location: ${r.location}`);
          if (r.createdAt) doc.text(`Created: ${r.createdAt}`);
          doc.moveDown();
          doc.fillColor('#000');
        });
      }

      doc.end();
      return;
    }

    return res.status(400).json({ message: 'Invalid format. Use csv or pdf.' });
  } catch (err) {
    console.error('export inventory error', err);
    res.status(500).json({ message: 'Failed to export inventory.' });
  }
});

router.get('/history', auth, async (req, res) => {
  const format = (req.query.format || 'csv').toLowerCase();
  try {
    const swaps = await SwapRequest.find({
      $or: [{ requester: req.user.id }, { receiver: req.user.id }],
      status: { $in: ['Accepted', 'Completed'] }
    })
      .sort({ updatedAt: -1 })
      .populate('requester receiver', 'username email')
      .populate('requestedItem offeredItem offeredItems', 'title condition category');

    const rows = swaps.map((s) => ({
      swapId: s._id,
      status: s.status,
      requester: s.requester?.username || '',
      receiver: s.receiver?.username || '',
      requestedItem: s.requestedItem?.title || '',
      offeredItems: (Array.isArray(s.offeredItems) && s.offeredItems.length > 0
        ? s.offeredItems
        : (s.offeredItem ? [s.offeredItem] : [])
      ).map((i) => i?.title).filter(Boolean).join('|'),
      updatedAt: s.updatedAt ? new Date(s.updatedAt).toISOString() : ''
    }));

    if (format === 'csv') {
      const csv = toCsv(rows, ['swapId', 'status', 'requester', 'receiver', 'requestedItem', 'offeredItems', 'updatedAt']);
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="swapsphere-transaction-history.csv"');
      return res.send(csv);
    }

    if (format === 'pdf') {
      const PDFDocument = require('pdfkit');
      const doc = new PDFDocument({ margin: 40 });
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="swapsphere-transaction-history.pdf"');
      doc.pipe(res);

      doc.fontSize(18).text('SwapSphere Transaction History Export', { align: 'left' });
      doc.moveDown(0.5);
      doc.fontSize(10).fillColor('#444').text(`Exported: ${new Date().toLocaleString()}`);
      doc.moveDown();
      doc.fillColor('#000');

      if (rows.length === 0) {
        doc.text('No transactions found.');
      } else {
        rows.forEach((r, idx) => {
          doc.fontSize(12).text(`${idx + 1}. Swap ${r.swapId}`);
          doc.fontSize(10).fillColor('#444').text(`Status: ${r.status} • Updated: ${r.updatedAt}`);
          doc.text(`Requester: ${r.requester} • Receiver: ${r.receiver}`);
          doc.text(`Requested: ${r.requestedItem}`);
          doc.text(`Offered: ${r.offeredItems.split('|').join(', ')}`);
          doc.moveDown();
          doc.fillColor('#000');
        });
      }

      doc.end();
      return;
    }

    return res.status(400).json({ message: 'Invalid format. Use csv or pdf.' });
  } catch (err) {
    console.error('export history error', err);
    res.status(500).json({ message: 'Failed to export history.' });
  }
});

module.exports = router;

