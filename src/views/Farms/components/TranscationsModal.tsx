import styled from "styled-components";
import React, { } from "react";
import { Flex, CloseIcon, IconButton } from "cryption-uikit";
import { makeStyles, withStyles, Theme, createStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButtonMui from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Modal from "components/Modal";
import useWeb3 from "hooks/useWeb3";
import StepperContainer from 'components/Stepper/Stepper';
import CopyToClipboard from 'components/CopyToClipboard';

interface Transcation {
  amount: string;
  currency: string;
  etherTxHash: string;
  farmContract: string;
  id: string;
  isActive: boolean;
  modifiedon: string;
  pid: number;
  polygonTimestamp: string | null;
  polygonTxHash: string | null;
  status: string;
  timestamp: string;
  userAddress: string;
}
interface DepositModalProps {
  transcations: Transcation[];
  onDismiss?: () => void;
  isOpen: boolean;
}
const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #404040;
  align-items: center;
  padding: 24px 24px;
  margin-bottom: 20px;
`;

const ModalTitle = styled(Flex)`
  align-items: center;
  flex: 1;
  font-size: 23px;
  color: #86878f;
`;
const Heading = styled.div`
  font-weight: 600;
  letter-spacing: -0.015em;
  text-transform: capitalize;
`;
const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});
const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
      background: '#1B1D25',
      color: 'white'
    },
  }),
)(TableCell);
function Row(props: { row: Transcation }) {
  const web3 = useWeb3();
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();
  let activeIndex = 0;
  if (row.status === 'stakedOnPolygon') {
    activeIndex = 2;
  } else if (row.status === 'depositeOnEthereum') {
    activeIndex = 1
  }
  return (
    <>
      <TableRow className={classes.root}>
        <StyledTableCell>
          <IconButtonMui aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon style={{ color: 'white' }} /> : <KeyboardArrowDownIcon style={{ color: 'white' }} />}
          </IconButtonMui>
        </StyledTableCell>
        <StyledTableCell>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {`${row.etherTxHash.slice(0, 12)}...${row.etherTxHash.slice(row.etherTxHash.length - 4)}`}
            <CopyToClipboard toCopy={row.etherTxHash} />
          </div>
        </StyledTableCell>
        <StyledTableCell >{web3.utils.fromWei(row.amount, 'ether')} Eth</StyledTableCell>
        <StyledTableCell>{row.status}</StyledTableCell>
      </TableRow>
      <TableRow>
        <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Transcation Status
              </Typography>
              <StepperContainer activeIndex={activeIndex} />
            </Box>
          </Collapse>
        </StyledTableCell>
      </TableRow>
    </>
  );
}
const TranscationsModal: React.FC<DepositModalProps> = ({
  transcations,
  isOpen,
  onDismiss,
}) => {
  return (
    <Modal
      // title={TranslateString(1068, "Stake LP tokens")}
      isOpen={isOpen}
      maxHeight={100}
      maxWidth={700}
      onDismiss={onDismiss}
    >
      <Flex flexDirection="column" width="100%">
        <ModalHeader>
          <ModalTitle>
            <Heading>All Cross Chain Transcations</Heading>
          </ModalTitle>
          <IconButton variant="text" onClick={onDismiss} aria-label="Close the dialog" size="23px">
            <CloseIcon color="#86878F" />
          </IconButton>
        </ModalHeader>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <StyledTableCell />
                <StyledTableCell>Transcation Hash</StyledTableCell>
                <StyledTableCell>Amount</StyledTableCell>
                <StyledTableCell>status</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transcations.map((row) => (
                <Row key={row.id} row={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* {showStakerSteps ?
          <StepperContainer activeIndex={activeIndex} />
          :
          <div>

          </div>
        } */}
      </Flex>
    </Modal>
  );
};

export default TranscationsModal;
