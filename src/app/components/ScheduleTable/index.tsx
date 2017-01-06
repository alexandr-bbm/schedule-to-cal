import * as React from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';


const getCellStyle = (idx) => (
  {
    overflow: 'visible',
    whiteSpace: 'normal',
    paddingLeft: 10,
    paddingRight: 10,
    width: idx === 0 ? '80px' : 'auto',
  }
);

interface IProps {
  lessonsForWeek: any;
  isDeleteMode: boolean;
  onDeleteRequest: (id) => void;
  tableHeaders: string[];
}

const TIME_COL_NUM = 1;

class ScheduleTable extends React.Component<IProps, any> {

  onCellClick (row, col) {
    console.log(`ScheduleTable isDeleteMode: ${this.props.isDeleteMode}`);
    if (this.props.isDeleteMode && col !== TIME_COL_NUM) {
      const arrCol = col - 1;
      const { id } = this.props.lessonsForWeek[row][arrCol];
      this.props.onDeleteRequest(id)
    }
  };

  public render() {
    const {lessonsForWeek: lessons, tableHeaders} = this.props;
    if (!lessons.length) {
      return <p>Произошла ошибка</p>
    }
    return (
      <Table selectable={false} onCellClick={this.onCellClick.bind(this)}>
        <TableHeader
          displaySelectAll={false}
          adjustForCheckbox={false}
        >
          <TableRow>
            {tableHeaders.map((day, idx) => (
              <TableHeaderColumn style={getCellStyle(idx)}>
                {day}
              </TableHeaderColumn>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {
            lessons.map(row => (
              <TableRow>
                {row.map((col, idx) => (
                  <TableRowColumn
                    style={getCellStyle(idx)}
                    className="schedule-cell"
                    data-id={col.id}
                  >
                    {col.text}
                  </TableRowColumn>
                ))}
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    );
  }
}

export { ScheduleTable }
