import React, { useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    IconButton,
    FormControlLabel,
    Switch,
    Grid,
    Link,
    Tooltip,
    Button,
    Chip
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
        height: 450
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
    textsm: {
        fontSize: "12px"
    }
}));

const DataTable = (props) => {
    const classes = useStyles();
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('calories');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const { rows, header } = props;
    const { enqueueSnackbar } = useSnackbar();

    const descendingComparator = (a, b, orderBy) => {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    const getComparator = (order, orderBy) => {
        return order === 'desc' ?
            (a, b) => descendingComparator(a, b, orderBy) :
            (a, b) => -descendingComparator(a, b, orderBy);
    }

    const stableSort = (array, comparator) => {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const createSortHandler = (property) => (event) => {
        handleRequestSort(event, property);
    };

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, (rows?.length ?? 0) - page * rowsPerPage);

    const _handleState = (id) => {
        props.handleState(id)
    }

    const _handleEdit = (id) => {
        props.handleEdit(id)
    }

    const _handleDelete = (id) => {
        props.handleDelete(id)
    }

    const _handleReactive = (id) => {
        props.handleReactive(id)
    }

    const handleCopyURL = (text, type = "") => {
        var dummy = document.createElement("textarea");
        document.body.appendChild(dummy);
        if (type == "FACEBOOK") {
            dummy.value = text + "?origin=FACEBOOK";
        }
        else if (type == "INSTAGRAM") {
            dummy.value = text + "?origin=INSTAGRAM";
        }
        else {
            dummy.value = text;
        }
        dummy.select();
        dummy.setSelectionRange(0, 99999);
        document.execCommand("copy");
        document.body.removeChild(dummy);
        enqueueSnackbar('URL copiado ' + type);
    }

    return (
        <div>


            <TableContainer>
                <Table
                    className={classes.table}
                    aria-labelledby="tableTitle"
                    size='medium'
                    aria-label="enhanced table"
                >
                    <TableHead>
                        <TableRow>
                            {header.map((headCell) => (
                                <TableCell
                                    key={headCell.id}
                                    align={headCell.numeric ? 'center' : 'center'}
                                    padding={headCell.disablePadding ? 'none' : 'none'}
                                    sortDirection={orderBy === headCell.id ? order : false}
                                    className={classes.textsm}
                                    style={{ textAlign: "center", backgroundColor: "#F6F6F6", fontWeight: "bold" }}
                                >
                                    <TableSortLabel
                                        active={orderBy === headCell.id}
                                        direction={orderBy === headCell.id ? order : 'asc'}
                                        onClick={createSortHandler(headCell.id)}
                                    >
                                        {headCell.label}
                                        {orderBy === headCell.id ? (
                                            <span className={classes.visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </span>
                                        ) : null}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            (typeof rows !== "undefined")
                                ?
                                stableSort(rows, getComparator(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {
                                        return (
                                            (<TableRow key={"r-" + row.id}>
                                                {
                                                    header.map((r, i) => {
                                                        return (
                                                            (r.index)
                                                                ?
                                                                <TableCell className={classes.textsm} align="center" key={i}>{index + 1}</TableCell>
                                                                :
                                                                (r.accion)
                                                                    ?
                                                                    <TableCell align="center" className={classes.textsm} key={i}>
                                                                        {
                                                                            (row["idState"] !== 3)
                                                                                ?
                                                                                <Fragment>
                                                                                    {
                                                                                        (r.edit)
                                                                                            ?
                                                                                            <Tooltip title="Editar" aria-label="Editar">
                                                                                                <IconButton aria-label="Editar" className={classes.margin} size="small" color="primary" onClick={() => _handleEdit(row["id"])}>
                                                                                                    <EditIcon fontSize="small" />
                                                                                                </IconButton>
                                                                                            </Tooltip>
                                                                                            :
                                                                                            <></>
                                                                                    }
                                                                                    {
                                                                                        (r.delete)
                                                                                            ?
                                                                                            <Tooltip title="Eliminar" aria-label="Eliminar">
                                                                                                <IconButton aria-label="Eliminar" className={classes.margin} size="small" color="secondary" onClick={() => _handleDelete(row["id"])}>
                                                                                                    <DeleteIcon fontSize="small" />
                                                                                                </IconButton>
                                                                                            </Tooltip>
                                                                                            :
                                                                                            <></>
                                                                                    }
                                                                                </Fragment>
                                                                                :
                                                                                <Fragment></Fragment>
                                                                        }
                                                                    </TableCell>
                                                                    : (r.state)
                                                                        ? <TableCell className={classes.textsm} align="center" key={i}>
                                                                            {
                                                                                (row[r.id] !== 3)
                                                                                    ?
                                                                                    <Tooltip title="Activar/Desactivar" aria-label="Activar/Desactivar">
                                                                                        <FormControlLabel
                                                                                            value="top"
                                                                                            label={(row[r.id] === 1 ? "Activo" : "Inactivo")}
                                                                                            className={classes.textsm}
                                                                                            control={<Switch color="primary" size="small" checked={(row[r.id] === 1 ? true : false)} onChange={() => _handleState(row["id"])} />}
                                                                                        />
                                                                                    </Tooltip>
                                                                                    :
                                                                                    <Button variant="contained" color="secondary" onClick={() => _handleReactive(row["id"])}>
                                                                                        Re-activar
                                                                                    </Button>
                                                                            }
                                                                        </TableCell>
                                                                        : <TableCell className={classes.textsm} align="center" key={i}>
                                                                            <Grid container xs={12}>
                                                                                <Grid item xs={7}>{row[r.id]} </Grid>
                                                                                {r.url
                                                                                    ?
                                                                                    (
                                                                                        <Grid item xs={5}>
                                                                                            <Tooltip title="Ir al sitio Miwhats" aria-label="Ir al sitio Miwhats">
                                                                                                <Link component="button" variant="body2" onClick={() => { window.open(row[r.id], '_blank'); }}>
                                                                                                    <FontAwesomeIcon icon={faExternalLinkAlt} style={{ marginRight: '5px' }} />
                                                                                                </Link>
                                                                                            </Tooltip>
                                                                                            <Tooltip title="Copiar URL Miwhats" aria-label="Copiar URL Miwhats">
                                                                                                <Link component="button" variant="body2" onClick={() => handleCopyURL(row[r.id], "")}>
                                                                                                    <FontAwesomeIcon icon={faCopy} style={{ marginRight: '5px' }} />
                                                                                                </Link>
                                                                                            </Tooltip>
                                                                                            <Tooltip title="Copiar URL Miwhats Facebook" aria-label="Copiar URL Miwhats Facebook">
                                                                                                <Link component="button" variant="body2" onClick={() => handleCopyURL(row[r.id], "FACEBOOK")}>
                                                                                                    <FontAwesomeIcon icon={faFacebook} style={{ marginRight: '5px' }} />
                                                                                                </Link>
                                                                                            </Tooltip>
                                                                                            <Tooltip title="Copiar URL Miwhats Instagram" aria-label="Copiar URL Miwhats Instagram">
                                                                                                <Link component="button" variant="body2" onClick={() => handleCopyURL(row[r.id], "INSTAGRAM")}>
                                                                                                    <FontAwesomeIcon icon={faInstagram} style={{ marginRight: '5px' }} />
                                                                                                </Link>
                                                                                            </Tooltip>
                                                                                            <Chip label={"VISITAS: " + row.views} variant="outlined" size="small" />
                                                                                            <Chip label={"CLICKS: " + row.click} variant="outlined" size="small" />
                                                                                        </Grid>
                                                                                    )
                                                                                    : <div></div>
                                                                                }
                                                                            </Grid>
                                                                        </TableCell>
                                                        )
                                                    })
                                                }
                                            </TableRow>)
                                        );
                                    })
                                : <div />
                        }
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={header.length} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                className={classes.textsm}
                labelRowsPerPage="Registros por pagina"
                labelDisplayedRows={(from = page) => (`${from.from}-${from.to === -1 ? from.count : from.to} de ${from.count}`)}
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={typeof rows !== "undefined" ? rows.length : 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </div>
    )
}



export default DataTable;