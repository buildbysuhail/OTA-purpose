import Slide, { SlideProps } from "@mui/material/Slide";
import { Alert, Snackbar } from "@mui/material";

function SlideTransition(props: SlideProps) {
	return <Slide {...props} direction="left" />;
}

interface ERPSnackbarProps {
	open: boolean;
	onClose: () => void;
	message: string;
	severity?: "success" | "info" | "warning" | "error";
	duration?: number;
}

const ERPSnackbar = (props: ERPSnackbarProps) => {
	return (
		<Snackbar
			open={props.open}
			onClose={props.onClose}
			TransitionComponent={SlideTransition}
			key={SlideTransition.name}
			anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
			autoHideDuration={props?.duration || 3000}
		>
			<Alert severity={props.severity} sx={{ marginRight: 26 }}>
				{props.message}
			</Alert>
		</Snackbar>
	);
};

export default ERPSnackbar;
