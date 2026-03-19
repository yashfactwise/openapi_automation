// Read contract-template.md (list API) and extract cost/tax/discount fields for a specific template
const fs = require('fs');
const raw = fs.readFileSync('c:\\In-Progress\\Curler\\contract-template.md', 'utf8');
const data = JSON.parse(raw);
const templates = data[0].templates;
const t = templates.find(x => x.template_id === '89c58d0e-d495-4385-bc7a-8e557e47ad5d');
if (!t) { console.log('not found'); process.exit(); }
console.log('LIST API - Template:', t.name);
t.section_list.forEach(s => {
  s.section_items.forEach(item => {
    const ai = item.additional_information || {};
    const hasCost = ai.additional_cost_information ? true : false;
    const hasTax = ai.taxes_information ? true : false;
    const hasDiscount = ai.discount_information ? true : false;
    if (hasCost || hasTax || hasDiscount) {
      const type = hasCost ? 'COST' : hasTax ? 'TAX' : 'DISCOUNT';
      console.log('  ['+type+'] name:', item.name, '| builtin:', item.is_builtin_field, '| mandatory:', item.is_mandatory, '| hidden:', ai.is_hidden);
    }
  });
});
