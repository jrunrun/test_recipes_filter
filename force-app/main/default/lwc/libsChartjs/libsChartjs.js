import {
    LightningElement
} from 'lwc';
import {
    loadScript,
    loadStyle
} from 'lightning/platformResourceLoader';
import chartjs from '@salesforce/resourceUrl/chartJs';
import tabFilters from '@salesforce/resourceUrl/tabFilters';
import tableauAPI from '@salesforce/resourceUrl/tableau250';

const generateRandomNumber = () => {
    return Math.round(Math.random() * 100);
};

export default class LibsChartjs extends LightningElement {
    error;
    chart;
    chartjsInitialized = false;

    // tableau stuff
    filters;
    viz;
    view_url = "https://demo.tservertrust.tableau.com/t/salesforce/views/JustinsSuperstoreDashboard/SSDashboard";
    containerDiv;
    viz_options;


    config = {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [
                    generateRandomNumber(),
                    generateRandomNumber(),
                    generateRandomNumber(),
                    generateRandomNumber(),
                    generateRandomNumber()
                ],
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)'
                ],
                label: 'Dataset 1'
            }],
            labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue']
        },
        options: {
            responsive: true,
            legend: {
                position: 'right'
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    };

    renderedCallback() {
        if (this.chartjsInitialized) {
            return;
        }
        this.chartjsInitialized = true;


        // tableau stuff
        this.viz_options = {
            hideTabs: true,
            hideToolbar: true,
             
            height: "800px",
            width: "800px",
            onFirstInteractive: this.defaultOnFirstInteractive.bind(this)
  
            // onFirstInteractive: () => {
            
            //     // this.defaultOnFirstInteractive();

            //     console.log("onFirstInteractive fired");
            //     console.log("viz object:");
            //     console.log(this.viz);
            //     // console.log("this.viz" + JSON.parse(JSON.stringify(this.viz)));
                
            //     console.log("url:");
            //     console.log(this.viz.getUrl());

            //     this.filters.discovery(this.viz);
            //     console.log(this.filters);

              
            //     //  this.tabfilters.discovery(this.viz).then(filters => { 
            //     //     console.log("promise resolved for tabfilters");
            //     //     console.log("tabfilters" + filters);
            //     //  });

            //     //  this.tabfilters.discovery(this.viz).then(reportSelectedFilters);


            //     // const filters = this.getFilters(this.viz);
            //     // console.log(filters);
            //     // this.showEditButton = false;

             

            // }






        };









        Promise.all([
                loadScript(this, chartjs + '/Chart.min.js'),
                loadStyle(this, chartjs + '/Chart.min.css'),
                loadScript(this, tabFilters),
                loadScript(this, tableauAPI)
            ])
            .then(() => {

                // disable Chart.js CSS injection
                window.Chart.platform.disableCSSInjection = true;

                const canvas = document.createElement('canvas');
                this.template.querySelector('div.chart').appendChild(canvas);
                const ctx = canvas.getContext('2d');
                this.chart = new window.Chart(ctx, this.config);

                // tabfilters
                this.filters = new TabFilters();
                console.log("this.filters");
                // console.log(JSON.parse(JSON.stringify(this.filters)));
                console.log(this.filters);
                

                // tableau stuff
                this.containerDiv = this.template.querySelector('[data-id="tableauViz"]');
                this.initViz();


            })
            .catch((error) => {
                this.error = error;
            });
    }

 
    // async defaultOnFirstInteractive(v) {
    //     viz = v.getViz();
      
    //     // tabfilters
    //     await tabfilters.discovery(viz);
      
    // }

    async defaultOnFirstInteractive() {
        console.log('defaultOnFirstInteractive')
        // tabfilters
        await this.filters.discovery(this.viz);
      
    }
      
    initViz() {
    
        console.log('init Viz!');
        this.containerDiv = this.template.querySelector('[data-id="tableauViz"]');
        console.log({
            view_url: this.view_url,
            viz_options: this.viz_options
        })
        this.viz = new tableau.Viz(this.containerDiv, this.view_url, this.viz_options);
        
    }
}

// TODO:
// 1. add tableau js api - DONE
// 2. add viz instantiating code - DONE
// 3. discover filters using tabfilter.discover(viz) via callback function