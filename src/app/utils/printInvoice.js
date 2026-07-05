export const printInvoice = (order) => {
  const printWindow = window.open("", "", "width=400,height=700");

  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td>${item.name}</td>
        <td style="text-align:center;">
          ${item.selectedVariant || "-"}
        </td>
        <td style="text-align:center;">
          ${item.qty}
        </td>
        <td style="text-align:right;">
          ₹${item.price}
        </td>
        <td style="text-align:right;">
          ₹${item.total ?? item.qty * item.price}
        </td>
      </tr>
    `
    )
    .join("");

  const totalQty = order.items.reduce(
    (sum, item) => sum + Number(item.qty),
    0
  );

  printWindow.document.write(`
<html>

<head>

<title>${order.order_id}</title>

<style>

*{
box-sizing:border-box;
}

body{

width:80mm;
margin:auto;
font-family:Courier New;
padding:8px;
font-size:12px;

}

h2,h3,p{

margin:4px 0;

}

.center{

text-align:center;

}

table{

width:100%;
border-collapse:collapse;
margin-top:8px;

}

th{

border-top:1px dashed #000;
border-bottom:1px dashed #000;
padding:5px;
font-size:11px;

}

td{

padding:4px;
font-size:11px;

}

.summary{

margin-top:10px;

}

.summary div{

display:flex;
justify-content:space-between;
padding:2px 0;

}

hr{

border:none;
border-top:1px dashed #000;
margin:8px 0;

}

.footer{

text-align:center;
margin-top:15px;
font-size:11px;

}

</style>

</head>

<body>

<div class="center">

<h2>KiranaNeeds</h2>

<p>Grocery Store</p>

<p>Thank you for shopping!</p>

</div>

<hr>

<div>

<div>Invoice : ${order.order_id}</div>

<div>Date : ${new Date(
    order.created_at
  ).toLocaleString()}</div>

<div>Name : ${order.name}</div>

<div>Phone : ${order.phone || "-"}</div>

<div>Address : ${order.address}</div>

</div>

<hr>

<table>

<thead>

<tr>

<th align="left">Item</th>

<th>Var</th>

<th>Qty</th>

<th align="right">Rate</th>

<th align="right">Amt</th>

</tr>

</thead>

<tbody>

${itemsHtml}

</tbody>

</table>

<hr>

<div class="summary">

<div>

<span>Total Items</span>

<span>${order.items.length}</span>

</div>

<div>

<span>Total Qty</span>

<span>${totalQty}</span>

</div>

<div>

<span>Discount</span>

<span>₹${order.discount || 0}</span>

</div>

<div style="font-weight:bold;font-size:15px;">

<span>Grand Total</span>

<span>₹${order.total}</span>

</div>

</div>

<hr>

<div class="center">

Status :
<b>${order.status.toUpperCase()}</b>

</div>

<div class="footer">

<p>***************</p>

<p>THANK YOU</p>

<p>Visit Again</p>

<p>Powered by KiranaNeeds POS</p>

</div>

<script>

window.onload=function(){

window.print();

setTimeout(()=>{

window.close();

},300);

}

</script>

</body>

</html>
`);

  printWindow.document.close();
};