import * as React from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import { ILesson } from "../../services/schedule/models";
import { uniqBy, groupBy } from "lodash";

const THS = [
  'Время',
  'Пн',
  'Вт',
  'Ср',
  'Чт',
  'Пт',
  'Сб',
];

export const getLessonsForRender = (lessons: ILesson[]): Array<any[]> => {
  let out = [];
  const groupedByTime = groupBy(lessons, 'timeStart');
  const startTimes = Object.keys(groupedByTime);

  const rowsNum = startTimes.length;
  const colsNum = THS.length;

  for (let i = 0; i < rowsNum; i++) {
    out[i] = [];
    for (let j = 0; j < colsNum; j++) {
      if (j === 0) {
        out[i][j] = startTimes[i]
      } else {
        const lessonForDay = groupedByTime[startTimes[i]].find(l => l.dayIdx === j - 1);
        out[i][j] = lessonForDay ?
          `${lessonForDay.subject} ${lessonForDay.lessonType}`
          : '';
      }
    }
  }

  return out;

};

const getCellStyle = (idx) => (
  {
    overflow: 'visible',
    whiteSpace: 'normal',
    paddingLeft: 10,
    paddingRight: 10,
    width: idx === 0 ? '80px' : 'auto',
  }
);

class ScheduleTable extends React.Component<any, any> {

  public render() {
    const lessons = getLessonsForRender(this.props.lessonsForWeek);
    if (!lessons.length) {
      return <p>Произошла ошибка</p>
    }
    return (
      <Table
        selectable={false}
        className={this.props.className}
      >
        <TableHeader
          displaySelectAll={false}
          adjustForCheckbox={false}
        >
          <TableRow>
            {THS.map((day, idx) => (
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
                  >
                    {col}
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
