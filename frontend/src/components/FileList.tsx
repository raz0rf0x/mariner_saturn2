import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CircularProgress from "@mui/material/CircularProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import LayersIcon from "@mui/icons-material/Layers";
import nullthrows from "nullthrows";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  DirectoryAPIResponse,
  FileAPIResponse,
  FileListAPIResponse,
  useAPI,
  withAPI,
  WithAPIProps,
} from "../api";
import { renderTime, sleep } from "../utils";
import FileDetailsDialog from "./FileDetailsDialog";
import UploadButton from "./UploadButton";

function DirectoryListItem({
  directory,
  onSelect,
}: {
  directory: DirectoryAPIResponse;
  onSelect: (dirname: string) => void;
}): React.ReactElement {
  return (
    <React.Fragment>
      <ListItem
        button
        key={directory.dirname}
        onClick={() => onSelect(directory.dirname)}
      >
        <ListItemIcon>
          <FolderIcon />
        </ListItemIcon>
        <ListItemText primary={directory.dirname} />
      </ListItem>
    </React.Fragment>
  );
}

function FileListItem({
  file,
  onDelete,
}: {
  file: FileAPIResponse;
  onDelete: () => void;
}): React.ReactElement {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const printTime = file.print_time_secs
    ? renderTime(file.print_time_secs)
    : null;
  const navigate = useNavigate();
  const api = useAPI();
  return (
    <React.Fragment>
      <ListItem button key={file.filename} onClick={handleClickOpen}>
        <ListItemIcon>
          {file.can_be_printed ? <LayersIcon /> : <InsertDriveFileIcon />}
        </ListItemIcon>
        <ListItemText primary={file.filename} secondary={printTime} />
      </ListItem>
      <FileDetailsDialog
        filename={file.filename}
        canBePrinted={file.can_be_printed}
        path={file.path}
        onCancel={handleClose}
        onClose={handleClose}
        onPrint={async () => {
          await api.startPrint(file.path);
          setOpen(false);
          navigate("/");
        }}
        onDelete={async () => {
          await api.deleteFile(file.path);
          setOpen(false);
          await onDelete();
        }}
        open={open}
        scroll="paper"
      />
    </React.Fragment>
  );
}

export interface FileListState {
  isLoading: boolean;
  path: string;
  data?: FileListAPIResponse;
}

const styles = () =>
  createStyles({
    loadingContainer: {
      flexGrow: 1,
      padding: 18,
      textAlign: "center",
    },
  });

class FileList extends React.Component<
  WithStyles & WithAPIProps,
  FileListState
> {
  state: FileListState = {
    isLoading: true,
    path: "",
  };

  async refresh(): Promise<void> {
    // FIXME: this is kind of nasty, it's just here because FileList sometimes
    // fails to render on storybook, which makes the storyshot tests for this
    // component fail when they run
    await sleep(0);
    const response = await this.props.api.listFiles(this.state.path);
    if (response) {
      this.setState({
        isLoading: false,
        data: response,
      });
    }
  }

  async componentDidMount(): Promise<void> {
    await this.refresh();
  }

  _renderContent(): React.ReactElement {
    if (this.state.isLoading) {
      return (
        <Box className={this.props.classes.loadingContainer}>
          <CircularProgress />
        </Box>
      );
    }

    const { directories, files } = nullthrows(this.state.data);
    const directoryListItems = directories.map((directory) => (
      <DirectoryListItem
        directory={directory}
        key={directory.dirname}
        onSelect={(dirname) =>
          this.setState(
            (state, _props) => ({
              isLoading: true,
              path: `${state.path}${dirname}/`,
              data: undefined,
            }),
            async () => await this.refresh()
          )
        }
      />
    ));
    const fileListItems = files.map((file) => (
      <FileListItem
        file={file}
        key={file.filename}
        onDelete={async () => await this.refresh()}
      />
    ));

    const parentDirectoryItem =
      this.state.path !== "" ? (
        <DirectoryListItem
          directory={{ dirname: ".." }}
          key=".."
          onSelect={(_) =>
            this.setState(
              (state, _props) => ({
                isLoading: true,
                path: state.path.replace(/[^/]+\/$/, ""),
                data: undefined,
              }),
              async () => await this.refresh()
            )
          }
        />
      ) : null;

    return (
      <List>
        {parentDirectoryItem}
        {directoryListItems}
        {fileListItems}
      </List>
    );
  }

  render(): React.ReactElement {
    return (
      <Card>
        <CardHeader
          title="Files"
          subheader={`/${this.state.path}`}
          action={
            <UploadButton onUploadFinished={async () => await this.refresh()} />
          }
        />
        <CardContent>{this._renderContent()}</CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(withAPI(FileList));
