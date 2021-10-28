<html>
    <head>
<style>
@page {
    background: #fff;
    padding:0px;
    margin:1cm 1cm;
}

body {
    font-size:32px;
}

.pdf-content {
    /*border:1px solid #003071;*/
    padding:20px;
    margin:32px;
}

table {
    width:100%;

}

table thead {
    display: table-header-group;
    text-align:center;
    width:100%;
}
table tfoot {
    display: table-footer-group;
}
table tbody {
}

table thead tr, table thead th{
    width:100%;
    background: #eee;

}

.header {
    width:100%;
    display:block;
    font-size:16px;
}

div.survey {
    page-break-after: avoid;
}

div.survey:last-child {
    page-break-after: avoid;
}

div.item {
    border:1px solid #003071;
    padding:0.5cm;
    page-break-after: always;

}

div.item-last {
    page-break-after: avoid !important;

}

h1 {
    font-size:20px;
    page-break-after: avoid;
}

img {
    page-break-after: avoid;
}

h2 {
    font-size:18px;
    page-break-after: avoid;
}

h3 {
    font-size:16px;
    page-break-after: avoid;
}

.picture img {
    display:inline-block;
}

p {
    font-size:14px;
}

</style>
    </head>
    <body>
        <?php echo $this->fetch('content'); ?>
    </body>
</html>