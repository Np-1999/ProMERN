import React from 'react';
import AsyncSelect from 'react-select/async';
import {withRouter} from 'react-router-dom';
import graphQLFetch from './graphQL.js';
import withToast from './withToast.jsx';

class Search extends React.Component {
    constructor(props){
        super(props);
        this.onChangeSelection = this.onChangeSelection.bind(this);
        this.loadOptions = this.loadOptions.bind(this);
    }
    onChangeSelection({value}) {
        const { history } = this.props;
        history.push(`/edit/${value}`);
    }
    async loadOptions(term) {
        if(term.length<3) return [];
        const query = `query issueList($search: String){
            issueList(search:$search){
                issues {id title}
            }
        }`;
        const { showError } = this.props;
        const data = await graphQLFetch(query,{ search:term }, showError);
        return data.issueList.issues.map(issue =>({
            label: `#${issue.id}: ${issue.title}`, value: issue.id,
        }));
    }
    render(){
        return(
            <AsyncSelect
            instanceId="search-select"
            value=""
            loadOptions={this.loadOptions}
            filter={()=> true}
            onChange={this.onChangeSelection}
            components={{DropdownIndicator: null}}></AsyncSelect>
        )
    }
}
export default withRouter(withToast(Search));