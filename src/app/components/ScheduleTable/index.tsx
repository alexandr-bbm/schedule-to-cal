import * as React from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import { ILesson } from "services/schedule/models";
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
        out[i][j] =  {text: startTimes[i]};
      } else {
        const lessonForDay = groupedByTime[startTimes[i]].find(l => l.dayIdx === j - 1);
        out[i][j] = lessonForDay
          ?
          {
            text: `${lessonForDay.subject} ${lessonForDay.lessonType}`,
            id: lessonForDay.id
          }
          :
          {text: ''};
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

interface IProps {
  lessonsForWeek: Array<ILesson>;
  isDeleteMode: boolean;
  onDeleteRequest: (id) => void;
}

class ScheduleTable extends React.Component<IProps, any> {

  onCellClick = (e) => {
    if (this.props.isDeleteMode) {
      const id = e.getAttribute('data-id');
      this.props.onDeleteRequest(id)
    }
  };

  public render() {
    const lessons = getLessonsForRender(this.props.lessonsForWeek);
    if (!lessons.length) {
      return <p>Произошла ошибка</p>
    }
    return (
      <Table selectable={false}>
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
              <TableRow onCellClick={this.onCellClick}>
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
