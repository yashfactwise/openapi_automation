const chunks=[];
process.stdin.on('data',c=>chunks.push(c));
process.stdin.on('end',()=>{
  const d=JSON.parse(Buffer.concat(chunks));
  console.log('Template:', d.name, '| status:', d.status);
  d.section_list.forEach(s=>{
    s.section_items.forEach(item=>{
      const ai=item.additional_information||{};
      const hasCost=ai.additional_cost_information ? true : false;
      const hasTax=ai.taxes_information ? true : false;
      const hasDiscount=ai.discount_information ? true : false;
      const isCustom=item.is_builtin_field===false && !hasCost && !hasTax && !hasDiscount;
      if(hasCost||hasTax||hasDiscount||isCustom){
        const type=hasCost?'COST':hasTax?'TAX':hasDiscount?'DISCOUNT':'CUSTOM';
        console.log('  ['+type+'] name:',item.name,'| builtin:',item.is_builtin_field,'| mandatory:',item.is_mandatory,'| hidden:',ai.is_hidden,'| cost_info:',JSON.stringify(ai.additional_cost_information||ai.taxes_information||ai.discount_information||'N/A'));
      }
    });
  });
});
