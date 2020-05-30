const continents=['Africa','America','Asia','Australia','Europe'];
const helloContinets=Array.from(continents, c => `Hello ${c}!`); 
const message = helloContinets.join( ' <br/> ');
const element=(
    <div title ="Outer Div">
        <h1> {message} </h1>
    </div>
)
ReactDOM.render(element,document.getElementById('content'));