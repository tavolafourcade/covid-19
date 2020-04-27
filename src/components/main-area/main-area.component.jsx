import React, { Component } from 'react';
import Title from '../title/Title';
import SearchBox from '../searchbox/SearchBox';
import Cards from '../cards/Cards';
import TimeSeries from './TimeSeries';

class MainArea extends Component {
    constructor(props){
        super(props);
        //state: object that describes the application
        this.state= {
            countries: [],
            searchField: '',
            isLoaded: false,
            countryName: '',
            totalConfirmed: '',
            totalRecovered: '',
            totalDeaths: '',
            mainDataBase:[],
            isLoaded2: false
        }
    }


    // Getting the data from the Covid API and saving it into our app component
    async componentDidMount(){
        const url = 'https://api.covid19api.com/summary';
        const response = await fetch(url);
        const data = await response.json();
        this.setState({
            countries: data,
            isLoaded: true
            })
        //console.log(data);

    }

    //Working with the SearchBox event
    onSearchChange = (event) => {
        //console.log(event.target.value);
        this.setState({ searchField: event.target.value })
        const filteredCountry = this.state.countries.Countries
            .filter(name => {
                return name.Country.toLowerCase() === event.target.value.toLowerCase();
            })

        if(filteredCountry.length){
            this.updateCard(filteredCountry[0]);
            const finalCountryChoosen = filteredCountry[0].Country;
            console.log('finalCountryChoosen', finalCountryChoosen)

            if(finalCountryChoosen){
                this.gettingCountrySearched(finalCountryChoosen)
            }

        }

    }



    async gettingCountrySearched(finalCountryChoosen){
        //const url = `https://api.covid19api.com/dayone/country/${finalCountryChoosen}/status/confirmed/live`;
        const url = `https://api.covid19api.com/total/dayone/country/${finalCountryChoosen}/status/confirmed`;

        const response = await fetch(url);
        const data = await response.json();
        console.log("Datos Confirmados", data)
        this.setState({
            mainDataBase: data,
            isLoaded2: true
        })
        console.log("MAIN DATA BASE",this.state.mainDataBase)
    }


    clearSearchField = () => {this.setState({searchField:''})}


    //Working with the Card component
    updateCard = (filteredCountry) => {
        console.log('run here',filteredCountry);
        const {Country, TotalConfirmed,TotalDeaths,TotalRecovered} = filteredCountry;
        this.setState({
            countryName: Country,
            totalConfirmed: TotalConfirmed,
            totalRecovered: TotalRecovered,
            totalDeaths: TotalDeaths

        })
    }



    render() {
        const {countries, searchField,isLoaded} = this.state;


        return (
            <div className='main-area column'>
                {
                    isLoaded?
                    <>
                        <Title updateTitle={this.state.countryName}/>
                        <SearchBox searchChange={this.onSearchChange}
                            clearField={this.clearSearchField} searchValue={this.state.searchField} />
                        <Cards updateCardTotalConfirmed={this.state.totalConfirmed}
                            updateCardTotalRecovered={this.state.totalRecovered}
                            updateCardTotalDeaths={this.state.totalDeaths}/>
                        <TimeSeries mainDataBase={this.state.mainDataBase}/>
                    </>
                    :(<div>loading...</div>)

                }
            </div>
        )
    }
}



export default MainArea;