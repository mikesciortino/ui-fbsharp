// src/Table.js
import React, {useState, useEffect} from "react";
import { useTable, useGlobalFilter, useAsyncDebounce, useFilters, useSortBy, usePagination  } from "react-table";
import { ChevronDoubleLeftIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDoubleRightIcon, RefreshIcon } from '@heroicons/react/solid'
import { Button, PageButton } from './shared/Button'
import classNames from 'classnames';
import axios from 'axios';

export function PositionFilter({ value }) {
  const position = value ? value.toLowerCase() : "unknown";

  return (
    <span
      className={classNames(
        "px-3 py-1 uppercase leading-wide font-bold text-xs rounded-full shadow-sm",
        position.startsWith("rb") ? "bg-green-100 text-green-700" : null,
        position.startsWith("te") ? "bg-yellow-100 text-yellow-700" : null,
        position.startsWith("qb") ? "bg-red-100 text-red-700" : null,
        position.startsWith("wr") ? "bg-blue-100 text-blue-700" : null
      )}
    >
      {position}
    </span>
  );
}


function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length
  const [value, setValue] = React.useState(globalFilter)
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined)
  }, 200)

  return (
    <label className="flex gap-x-2 items-baseline ">
      <span className="text-gray-700">Search: </span>
      <input
        type="text"
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        value={value || ""}
        onChange={e => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
      />
    </label>
  )
}

export function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id, render},
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  // Render a multi-select box
  return (
    <label className="flex gap-x-2 items-baseline">
      <span className="text-gray-700">{render("Header")}: </span>
      <select
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        name={id}
        id={id}
        value={filterValue}
        onChange={e => {
          setFilter(e.target.value || undefined)
        }}
      >
        <option value="">All</option>
        {options.map((option, i) => (
          <option key={i} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

export function Table({ columns, data, draftedPlayers }) {
  // Use the state and functions returned from useTable to build your UI
  const { 
    getTableProps,
    getTableBodyProps, 
    headerGroups, 
    prepareRow,
    page,
    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state, 
    preGlobalFilteredRows,
    setGlobalFilter, 
    } = useTable({columns,data,},
    useFilters,
    useGlobalFilter,// new
    useSortBy,  // new
    usePagination,  // new
    );
    console.log(draftedPlayers);
  // Render the UI for your table
  return (
    <>
      <div className="w-full">
        <div className="flex justify-between">
          <div className="w-8/12 mr-2" >
            <GlobalFilter
              preGlobalFilteredRows={preGlobalFilteredRows}
              globalFilter={state.globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
          </div>
          <div className="w-4/12 ml-2">
            {headerGroups.map((headerGroup) =>
              headerGroup.headers.map((column) =>
                column.Filter ? (
                  <div key={column.id}>
                    {column.render("Filter")}
                  </div>
                  ) : null
                )
              )}
          </div>
          {/* <div className="w-1/12 ml-2 mt-2">
            <Button onClick={DraftedFilter(draftid)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            </Button> px-3 py-1 uppercase
          </div> */}
        </div> 
      </div>

      <div className="mt-2 flex flex-col">
        <div className="-my-2 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps() }>
                      {headerGroup.headers.map(column => (
                        // Add the sorting props to control sorting. For this example
                        // we can add them into the header props
                        <th
                          scope="col"
                          className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                          {...column.getHeaderProps(column.getSortByToggleProps())}
                        >
                          {column.render('Header')}
                          {/* Add a sort direction indicator */}
                          <span>
                            {column.isSorted
                              ? column.isSortedDesc
                                ? ' ▼'
                                : ' ▲'
                              : ''}
                          </span>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody
                  {...getTableBodyProps()}
                  className="bg-white divide-y divide-gray-200"
                >
                  {page.map((row, i) => {  // new
                    prepareRow(row)
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map(cell => {
                          return (
                            <td
                              {...cell.getCellProps({
                                style: {
                                  // color : cell.value === "6813" ? 'red': null,
                                  backgroundColor : draftedPlayers.find(u => u.player_id === cell.value) ? 'red': null,
                                }
           
                             })}
                              className="px-6 py-4 whitespace-nowrap"
                            >
                              {cell.render('Cell')}
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {/* new */}
              <div className="py-3 flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <Button onClick={() => previousPage()} disabled={!canPreviousPage}>Previous</Button>
                  <Button onClick={() => nextPage()} disabled={!canNextPage}>Next</Button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div className="flex gap-x-2">
                    <span className="text-sm text-gray-700">
                      Page <span className="font-medium">{state.pageIndex + 1}</span> of <span className="font-medium">{pageOptions.length}</span>
                    </span>
                    <label>
                      <span className="sr-only">Items Per Page</span>
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        value={state.pageSize}
                        onChange={e => {
                          setPageSize(Number(e.target.value))
                        }}
                      >
                        {[10, 20, 50, 100, 200].map(pageSize => (
                          <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <PageButton
                        className="rounded-l-md"
                        onClick={() => gotoPage(0)}
                        disabled={!canPreviousPage}
                      >
                        <span className="sr-only">First</span>
                        <ChevronDoubleLeftIcon className="h-5 w-5" aria-hidden="true" />
                      </PageButton>
                      <PageButton
                        onClick={() => previousPage()}
                        disabled={!canPreviousPage}
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                      </PageButton>
                      <PageButton
                        onClick={() => nextPage()}
                        disabled={!canNextPage
                        }>
                        <span className="sr-only">Next</span>
                        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                      </PageButton>
                      <PageButton
                        className="rounded-r-md"
                        onClick={() => gotoPage(pageCount - 1)}
                        disabled={!canNextPage}
                      >
                        <span className="sr-only">Last</span>
                        <ChevronDoubleRightIcon className="h-5 w-5" aria-hidden="true" />
                      </PageButton>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>      
    </>
  )
}

export default Table;