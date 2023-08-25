import axios from 'axios';
import React, {useState, useEffect, useMemo} from 'react';
import Table, {SelectColumnFilter, PositionFilter, } from "./Table";

function Ranks(){
  const [loadingData, setLoadingData] = useState(true);
  const [data, setData] = useState([]);
  
  const columns = useMemo(() => [
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
      Header: "Age",
      accessor: "age",
    },
    {
      Header: "Priority",
      accessor: "priority",
    },
    {
      Header: "Position",
      accessor: "position",
      Filter: SelectColumnFilter,  // new
    },
    {
      Header: "DRAFTED",
      accessor: "player_id",
    },
  ]);

  useEffect(() => {
    async function getData(){
      await axios
        //.get("http://127.0.0.1:8000/ranks/?ordering=rank")
        .get("https://api-fbsharp.azurewebsites.net/ranks/?ordering=rank")
        .then((response) => {
          //console.log(response.data);
          setData(response.data);
          setLoadingData(false);
        });
    }
    if (loadingData) {
      getData();
      
    }
  }, [loadingData] )

  const loadTable = useMemo(() => {
    return (
      <Table columns={columns} data={data} />
    )
  }, [columns, data]);

  return (  
    <div className="App min-h-screen bg-gray-100 text-gray-900">
      <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <h1 className="text-xl font-semibold"> Ranks</h1>
        <div className="w-full">
          {loadingData ? (
          <p>Loading Data...</p>
        ):(
          <div className='mt-4 grid'>
            {loadTable}
          </div>
          
        )}
        </div>
        
      </header>
      
    </div>
  );
  
}

export default Ranks;
