import React, { Component } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import './App.css';

library.add(faTimes);

const people = [
  {name: '현모', color: '#603ff8', highlight: '#cac7ff'},
  {name: '동규', color: '#57af23', highlight: '#c4ff80'},
  {name: '충명', color: '#d49450', highlight: '#ffe7a0'}
];

const Person = ({index}) => {
  return (
    <span style={{color: people[index].color, fontWeight: 'bold'}}>
      {people[index].name}
    </span>
  );
}

class Table extends Component {
  constructor(props) {
    super(props);

    this.displayedColumns = [1, 2, 3, 4, 5, 6, 7, '⋯'];
    this.displayedRows = [1, 2, 3, 4, 5, 6, 7, 8, '⋮'];
    this.toggleCell = this.toggleCell.bind(this);
    this.togglePropertyFilter = this.togglePropertyFilter.bind(this);
    this.toggleColumn = this.toggleColumn.bind(this);
    this.toggleRow = this.toggleRow.bind(this);
  }

  componentWillMount() {
    const state = {
      isDisabled: [],
      isDark: [],
      isActive: [],
      isHighlighted: [],
      propertyFilter: {
        isDisabled: true,
        isDark: false,
        isActive: false,
        isHighlighted: false
      },
      highlightedColumns: [],
      highlightedRows: []
    }

    for (let i = 0; i <= this.displayedRows.length; i++) {
      state.isDisabled.push([]);
      state.isDark.push([]);
      state.isActive.push([]);
      state.isHighlighted.push([]);
      for (let j = 0; j <= this.displayedColumns.length; j++) {
        state.isDisabled[i].push(i == j);
        state.isDark[i].push(i == j);
        state.isActive[i].push(false);
        state.isHighlighted[i].push(false);
      }
    }

    for (let i = 0; i <= this.displayedRows.length; i++) {
      state.highlightedRows.push(false);
    }

    for (let j = 0; j <= this.displayedColumns.length; j++) {
      state.highlightedColumns.push(false);
    }

    this.setState(state);
  }

  toggleCell(row, col) {
    const nextState = Object.assign({}, this.state);
    Object.keys(nextState.propertyFilter).map(property => {
      nextState[property][row][col] =
        nextState.propertyFilter[property] ^ nextState[property][row][col];
    })
    this.setState(nextState);
  }

  togglePropertyFilter(filterName) {
    const nextFilter = Object.assign({}, this.state.propertyFilter);
    nextFilter[filterName] = !nextFilter[filterName];
    this.setState({propertyFilter: nextFilter});
  }

  toggleColumn(col) {
    const nextColumns = Object.assign({}, this.state.highlightedColumns);
    nextColumns[col] = !nextColumns[col];
    this.setState({highlightedColumns: nextColumns});
  }

  toggleRow(row) {
    const nextRows = Object.assign({}, this.state.highlightedRows);
    nextRows[row] = !nextRows[row];
    this.setState({highlightedRows: nextRows});
  }

  render() {

    return (
      <div className="table-container">
        <table>
          <tbody>
            <tr>
              <td></td>
              {/* Column headers */}
              {this.displayedColumns.map((_, col) =>
                <th key={col}>
                  <div
                    className="content column-header"
                    onClick={() => this.toggleColumn(col)}
                    style={{
                      color: this.state.highlightedColumns[col]
                        ? people[this.props.colPerson].color
                        : ''
                    }}
                  >
                    {this.displayedColumns[col]}
                  </div>
                </th>
              )}
            </tr>
            {/* Rows */}
            {this.displayedRows.map((_, row) =>
              <tr key={row}>
                {/* Row header */}
                <th>
                  <div
                    className="content row-header"
                    onClick={() => this.toggleRow(row)}
                    style={{
                      color: this.state.highlightedRows[row]
                        ? people[this.props.rowPerson].color
                        : ''
                    }}
                  >
                    {this.displayedRows[row]}
                  </div>
                </th>
                {/* Cells */}
                {this.displayedColumns.map((_, col) => {
                  return (
                    <td key={col} className="cell">
                      <div
                        className={classnames(
                          'content',
                          {'is-dark': this.state.isDark[row][col]},
                          {'is-active': this.state.isActive[row][col]},
                          {'is-highlighted': this.state.isHighlighted[row][col]},
                        )}
                        style={{
                          backgroundColor: this.state.highlightedColumns[col]
                            ? people[this.props.colPerson].highlight
                            : this.state.highlightedRows[row]
                              ? people[this.props.rowPerson].highlight
                              : ''
                        }}
                        onClick={() => this.toggleCell(row, col)}
                      >
                        {this.state.isDisabled[row][col]
                          ? <FontAwesomeIcon icon="times" size="2x" />
                          : ''}
                      </div>
                    </td>
                  );
                })}
              </tr>
            )}
          </tbody>
        </table>

        <div className="column-label">
          <Person index={this.props.colPerson} />
          의 모자에 적힌 수
        </div>
        <div className="row-label">
          <Person index={this.props.rowPerson} />
          의 모자에 적힌 수
        </div>

        <div>
          Toggle Filters
          <label>
            <input
              name="isDisabled"
              type="checkbox"
              checked={this.state.propertyFilter.isDisabled}
              onChange={() => this.togglePropertyFilter('isDisabled')}
            />
            isDisabled (Display X mark)
          </label>
          <label>
            <input
              name="isActive"
              type="checkbox"
              checked={this.state.propertyFilter.isActive}
              onChange={() => this.togglePropertyFilter('isActive')}
            />
            isActive (Color X mark)
          </label>
          <label>
            <input
              name="isHighlighted"
              type="checkbox"
              checked={this.state.propertyFilter.isHighlighted}
              onChange={() => this.togglePropertyFilter('isHighlighted')}
            />
            isHighlighted (Highlight cell color)
          </label>
        </div>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div>
        <div className="cols">
          <div className="col">
            <h2><Person index={0} /></h2>
            <Table
              person={0}
              colPerson={2}
              rowPerson={1}
            />
          </div>
          <div className="col">
            <h2><Person index={1} /></h2>
            <Table
              person={1}
              colPerson={2}
              rowPerson={0}
            />
          </div>
          <div className="col">
            <h2><Person index={2} /></h2>
            <Table
              person={2}
              colPerson={1}
              rowPerson={0}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
