import serialize from 'serialize-javascript';
export default function template(body,intialData,userData) {
    return `<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://apis.google.com/js/api:client.js"></script>
        <link rel="stylesheet" href="/bootstrap/css/bootstrap.min.css" />        
        <style>
            .test{
                color:blue;
            }
             .active {background-color: #D8D8F5;} 
             input.invalid {border-color: red;}
             div.error {color: red;}
            #nav-dropdown:after {
                 display: none;
            }
            nav {
                margin-bottom: 20px;
            }
            .card-header{
                cursor: pointer;
            }
            table.table-hover tr {cursor: pointer;}
        </style>
    </head>
    <body>
        <div id="content">${body}</div>
        <script>window.__INITIAL_DATA__=${serialize(intialData)}
                window.__USER_DATA__=${serialize(userData)}
        </script> 
    </body>
    <script src="/env.js"></script>
    <script src="/vendor.bundle.js"></script>
    <script src="/app.bundle.js"></script>
</html>`;
}
