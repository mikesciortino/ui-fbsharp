import { data } from 'autoprefixer';
import axios from 'axios';
import React, {useState, useEffect, useMemo} from 'react';
import logo from './logo.svg';
import Table, {SelectColumnFilter, PositionFilter, } from "./Table";

function Ranks(){
  const [loadingData, setLoadingData] = useState(true);
  const [data, setData] = useState([]);
  const [drafted, setDrafted] = useState([]);
  const [draftID, setDraftID] = useState([]);
  const [draftURL, setDraftURL] = useState();

  const handleInput = event => {
    setDraftID(event.target.value);
    setDraftURL("https://api.sleeper.app/v1/draft/" + draftID + "/picks");
    console.log(draftURL);
  };

  const refreshDraft = useMemo(() => {
    async function getData(){
      await axios
        .get("https://api.sleeper.app/v1/draft/" + draftID + "/picks")
        .then((response) => {
          //console.log(response.data);
          setDrafted(response.data);
        });
    }
    
      return (
        <div>
          <button onClick={getData} >Refresh</button>
        </div>
    )
  }, [draftID]);
  
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
    {
      Header: "DRAFTED",
      accessor: "player_id",
      Cell: s => (
        <span className={drafted.find(u => u.player_id === s.value) ? "bg-red-700 text-red-700" : null}>
          {s.value} 
        </span>
      ),
      // Cell:  s => {
      //   s.value === "6813" ? "bg-green-100 text-green-700" : null;
      // }
    },
  ],[drafted]);

  useEffect(() => {
    async function getData(){
      await axios
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
          <div className="w-fit flex sticky top-1 bg-white p-3 shadow overflow-hidden border-b" >
            <input placeholder="Enter Draft ID" onChange={handleInput}/>
            {refreshDraft}
          </div>
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
