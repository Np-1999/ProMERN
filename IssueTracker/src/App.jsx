const dateregex= new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');
function jsonDateReviver(key, value) {  
    if (dateregex.test(value)) 
        return new Date(value);  
    return value; 
}

class IssueFilter extends React.Component{
    render(){
        return(
            <div> Place Holder For filter  </div>
        );
    }
}
function IssueRow(props){
    const issue=props.issue;
        return(
            <tr>
                <td>{issue.id}</td>
                <td>{issue.status}</td>
                <td>{issue.owner}</td>
                <td>{issue.created.toDateString()}</td>
                <td>{issue.effort}</td>
                <td>{issue.due ? issue.due.toDateString():''}</td>
                <td>{issue.title}</td>
            </tr>

        );
}


const IntialIssues = [  {    
    id: 1, 
    status: 'New', 
    owner: 'Ravan', 
    effort: 5,    
    created: new Date('2018-08-15'), 
    due: undefined,    
    title: 'Error in console when clicking Add',  },
{
    id: 2, 
    status: 'Assigned', 
    owner: 'Eddie', 
    effort: 14,    
    created: new Date('2018-08-16'), 
    due: new Date('2018-08-30'),    
    title: 'Missing bottom border on panel',
}]
const issue={
        status: 'New',
        owner: 'Pieta',
        title : 'completion date should be optional'
    };

function IssueTable(props){
    const issueRows = props.issues.map(issue => <IssueRow  issue={issue}/>); 
    const rowStyle = {};
    return( <table className="bordered-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Status</th>
                        <th>Owner</th>
                        <th>Created</th>
                        <th>Effort</th>
                        <th>Due Date</th>
                        <th>Title</th>
                    </tr>
                </thead>
                <tbody>
                 {issueRows}
                </tbody>               
            </table>);
}

class IssueAdd extends React.Component{
    constructor(){
        super();
        this.handleSubmit=this.handleSubmit.bind(this);
    }
    handleSubmit(e){
        e.preventDefault();
        const form=document.forms.issueAdd;
        const issue={
            owner : form.owner.value,
            title : form.title.value,
            due:new Date(new Date().getTime() + 1000*60*60*24*10)
        }
        this.props.createIssue(issue);
        form.owner.value="";
        form.title.value="";
    }
    render(){
        return(
            <form name="issueAdd" onSubmit={this.handleSubmit}>        
                <input type="text" name="owner" placeholder="Owner" />        
                <input type="text" name="title" placeholder="Title" />        
                <button>Add</button>      
            </form> 
        );
    }
}
class IssueList extends React.Component{
    constructor(){
        super();
        this.state={issues: []};
        this.createIssue=this.createIssue.bind(this);
    }
    async loadData(){
        const query=`
        query{
            issueList{
                id
                status
                owner
	            title
                effort
                created
                due
            }
        }`;
        const response= await fetch('/graphql',{
            method:'POST',
            headers : { 'Content-Type': 'application/JSON'},
            body:JSON.stringify({query})
        });
        const body= await response.text();
        const result= JSON.parse(body,jsonDateReviver);
        console.log(result.data);
        this.setState({ issues:result.data.issueList });
        console.log(this.state.issues);
    }
    
    async createIssue(issue){
            const query=`mutation{
                issueAdd(issue:{
                    title: "${issue.title}",
                    owner : "${issue.owner}",
                    due : "${issue.due.toISOString()}"
                }){
                    id
                }
            }`;
            const response = await fetch('/graphql',{
                method :'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({query})
            });
            this.loadData();
    }
    async componentDidMount(){
        this.loadData();
    }
    render(){
        return(
            <React.Fragment>
                <h1>Issue Tracker</h1>
                <IssueFilter/>
                <hr />
                <IssueTable issues={this.state.issues}/>
                <hr />
                <IssueAdd createIssue={this.createIssue}/>
            </React.Fragment>
        );
    }
}
const element= <IssueList />;
ReactDOM.render(element,document.getElementById('content'));