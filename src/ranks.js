import { data } from 'autoprefixer';
import axios from 'axios';
import React, {useState, useEffect, useMemo} from 'react';
import logo from './logo.svg';
import Table, {SelectColumnFilter, PositionFilter} from "./Table";


function Ranks(){
  const [loadingData, setLoadingData] = useState(true);
  const [data, setData] = useState([]);
  const columns = [
      {
        Header: "Rank",
        accessor: "rank",
      },  
      {
        Header: "Name",
        accessor: "full_name",
        filter: 'includes',  // new
      },
      {
        Header: "Positional Rank",
        accessor: "positionalRank",
        Cell: PositionFilter, // new
      },
      {
        Header: "Team",
        accessor: "team",
        filter: 'includes',  // new
      },
      {
        Header: "ADP",
        accessor: "adp",
      },
      {
        Header: "ADP Delta",
        accessor: "adpDelta",
      },
      {
        Header: "Position",
        accessor: "position",
        Filter: SelectColumnFilter,  // new
      },
    ];
   
    useEffect(() => {
      async function getData(){
        await axios
          .get("http://127.0.0.1:8000/ranks/?ordering=rank")
          .then((response) => {
            console.log(response.data);
            setData(response.data);
            setLoadingData(false);
          });
      }
      if (loadingData) {
        getData();
      }
    }, [loadingData] )

  return (  
    <div className="App min-h-screen bg-gray-100 text-gray-900">
      <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <h1 className="text-xl font-semibold"> Ranks</h1>
        {loadingData ? (
          <p>Loading Data...</p>
        ):(
          <div className='mt-4 grid'>
            <Table columns={columns} data={data} />
          </div>
          
        )}
      </header>
      
    </div>
  );
  
}

export default Ranks;
