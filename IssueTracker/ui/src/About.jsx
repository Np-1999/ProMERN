import React from 'react';
import store from './store.js';
import graphQLFetch from './graphQL.js';

export default class  About extends React.Component {
    constructor(props) {
        super(props);
        const apiAbout = store.intialData ? store.intialData.about : null;
        delete store.intialData;
        this.state = {  apiAbout };
    }
    static async fetchData() {
        const data = await graphQLFetch('query {about} ');
        return data;
    }
    async componentDidMount () {
        const {apiAbout} = this.state;
        if(apiAbout==null) {
            const data = await About.fetchData();
            this.setState({apiAbout: data.about});
        }
    }
    render() {
        const {apiAbout} = this.state;
        return (
            <div className="text-center">
                <h3>Issue Tracker Version 0.9</h3>
                <h4>
                    {apiAbout}
                </h4>
            </div>
        );
    }
    
}