import React, { useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import numeral from 'numeral';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { makeStyles } from '@material-ui/core/styles';

DataTable.propTypes = {
  bodyRows: PropTypes.arrayOf(PropTypes.object),
  elevation: PropTypes.number,
  headCells: PropTypes.arrayOf(PropTypes.object),
  initialOrder: PropTypes.oneOf(['asc', 'desc']),
  initialOrderBy: PropTypes.string,
};

const useStyles = makeStyles(theme => ({
  paper: {
    marginBottom: theme.spacing(2),
    width: '100%',
  },
  root: {
    width: '100%',
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

export default function DataTable({
  bodyRows,
  elevation,
  headCells,
  initialOrder = 'asc',
  initialOrderBy = '',
}) {
  const classes = useStyles();

  const [order, setOrder] = useState(initialOrder);
  const [orderBy, setOrderBy] = useState(initialOrderBy);
  const [page, setPage] = useState(0);
  const pageSizes = [10, 25, 50];
  const [rowsPerPage, setRowsPerPage] = useState(pageSizes[0]);

  const _requestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const _changePage = (event, newPage) => {
    setPage(newPage);
  };

  const _changeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, bodyRows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} elevation={elevation}>
        <TableContainer>
          <Table
            aria-label="data table"
            aria-labelledby="tableTitle"
            size="big"
          >
            <DataTableHead
              cells={headCells}
              classes={classes}
              onRequestSort={_requestSort}
              order={order}
              orderBy={orderBy}
            />
            <TableBody>
              {_.orderBy(bodyRows, [orderBy], [order])
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(({ id, ...bodyRow }) => {
                  return (
                    <TableRow hover key={id} tabIndex={-1}>
                      {Object.keys(bodyRow).map((bodyCell, index) => {
                        // Make the first cell in the row a 'th'
                        const cellProps =
                          index === 0
                            ? { component: 'th', scope: 'row' }
                            : { align: 'right' };

                        return (
                          <TableCell key={index} {...cellProps}>
                            {/* If value is a number, format it */}
                            {!isNaN(bodyRow[bodyCell])
                              ? numeral(bodyRow[bodyCell]).format('0,0')
                              : bodyRow[bodyCell]}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}

              {emptyRows > 0 && (
                <TableRow style={{ height: 33 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="nav"
          count={bodyRows.length}
          onChangePage={_changePage}
          onChangeRowsPerPage={_changeRowsPerPage}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={pageSizes}
        />
      </Paper>
    </div>
  );
}

function DataTableHead({ cells, classes, onRequestSort, order, orderBy }) {
  const _createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {cells.map(({ id, label }, index) => (
          <TableCell
            align={index === 0 ? 'left' : 'right'}
            key={id}
            sortDirection={orderBy === id ? order : false}
          >
            <TableSortLabel
              active={orderBy === id}
              direction={orderBy === id ? order : 'asc'}
              onClick={_createSortHandler(id)}
            >
              {label}
              {orderBy === id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
