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
  {name: '충명', color: '#dd9d3a', highlight: '#ffe7a0'}
];

const Person = ({index}) => {
  return (
    <span style={{color: people[index].color, fontWeight: 'bold'}}>
      {people[index].name}
    </span>
  );
}

const EditTypeSelector = ({editType, onSelectionChange}) => {
  return (
    <div>
      Select edit type:
      <label>
        <input
          value="blackMark"
          type="radio"
          checked={editType === 'blackMark'}
          onChange={onSelectionChange}
        />
        Display black X mark
      </label>
      <label>
        <input
          value="redMark"
          type="radio"
          checked={editType === 'redMark'}
          onChange={onSelectionChange}
        />
        Display red X mark
      </label>
      <label>
        <input
          value="isHighlighted"
          type="radio"
          checked={editType === 'isHighlighted'}
          onChange={onSelectionChange}
        />
        isHighlighted (Highlight cell color)
      </label>
    </div>
  );
};

class Table extends Component {
  constructor(props) {
    super(props);

    this.displayedColumns = [1, 2, 3, 4, 5, 6, 7, '⋯'];
    this.displayedRows = [1, 2, 3, 4, 5, 6, 7, '⋮'];
    this.editCell = this.editCell.bind(this);
    this.toggleColumn = this.toggleColumn.bind(this);
    this.toggleRow = this.toggleRow.bind(this);
  }

  componentWillMount() {
    const state = {
      markType: [],
      isDark: [],
      isHighlighted: [],
      propertyFilter: {
        blackMark: true,
        redMark: false,
        isDark: false,
        isHighlighted: false
      },
      highlightedColumns: [],
      highlightedRows: []
    }

    for (let i = 0; i <= this.displayedRows.length; i++) {
      state.markType.push([]);
      state.isDark.push([]);
      state.isHighlighted.push([]);
      for (let j = 0; j <= this.displayedColumns.length; j++) {
        state.markType[i].push(i === j ? 1 : 0);
        state.isDark[i].push(i === j);
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

  editCell(row, col) {
    const nextState = Object.assign({}, this.state);
    const editType = this.props.editType;
    if (editType === 'isHighlighted') {
      nextState.isHighlighted[row][col] = !nextState.isHighlighted[row][col];
    } else if (editType === 'blackMark') {
      if (nextState.markType[row][col] !== 1) {
        nextState.markType[row][col] = 1
      } else {
        nextState.markType[row][col] = 0
      }
    } else if (editType === 'redMark') {
      if (nextState.markType[row][col] !== 2) {
        nextState.markType[row][col] = 2
      } else {
        nextState.markType[row][col] = 0
      }
    }

    this.setState(nextState);
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
              <td className="empty"></td>
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
                  {/* NanumSquare assigns an empty glyph for unsupported characters. */}
                  {/* For that reason, using font fallback with NanumSquare is not possible. */}
                  {/* To use character '⋮', I added 'no-nanumsquare' CSS class here. */}
                  <div
                    className={classnames(
                      'content row-header',
                      {'no-nanumsquare': row === this.displayedRows.length - 1},
                    )}
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
                          {'is-red-mark': this.state.markType[row][col] === 2},
                          {'is-highlighted': this.state.isHighlighted[row][col]},
                        )}
                        style={{
                          backgroundColor: this.state.highlightedColumns[col]
                            ? people[this.props.colPerson].highlight
                            : this.state.highlightedRows[row]
                              ? people[this.props.rowPerson].highlight
                              : ''
                        }}
                        onClick={() => this.editCell(row, col)}
                      >
                        {this.state.markType[row][col] !== 0
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
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editType: 'blackMark'
    };

    this.handleEditTypeChange = this.handleEditTypeChange.bind(this);
  }

  handleEditTypeChange(e) {
    this.setState({
      editType: e.target.value
    });
  }

  render() {
    return (
      <div>
        <div className="cols">
          <div className="col">
            <h1><Person index={0} />의 시점</h1>
            <Table
              person={0}
              colPerson={2}
              rowPerson={1}
              editType={this.state.editType}
            />
          </div>
          <div className="col">
            <h1><Person index={1} />의 시점</h1>
            <Table
              person={1}
              colPerson={2}
              rowPerson={0}
              editType={this.state.editType}
            />
          </div>
          <div className="col">
            <h1><Person index={2} />의 시점</h1>
            <Table
              person={2}
              colPerson={1}
              rowPerson={0}
              editType={this.state.editType}
            />
          </div>
        </div>
        <EditTypeSelector
          editType={this.state.editType}
          onSelectionChange={this.handleEditTypeChange}
        />
      </div>
    );
  }
}

export default App;
