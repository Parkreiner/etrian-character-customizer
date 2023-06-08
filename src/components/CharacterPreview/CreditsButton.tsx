import Modal from "../Modal";

export default function CreditsButton() {
  return (
    <Modal
      buttonText="Credits"
      modalTitle="Credits"
      modalDescription="Special thanks and colophon"
    >
      <Modal.Subheader>Special Thanks</Modal.Subheader>

      <Modal.List>
        <Modal.ListItem>b</Modal.ListItem>
      </Modal.List>

      <Modal.Subheader>Typesetting info</Modal.Subheader>

      <Modal.Paragraph italicized>
        Set with{" "}
        <Modal.Link href="https://fonts.google.com/specimen/Proza+Libre">
          Proza Libre
        </Modal.Link>{" "}
        and{" "}
        <Modal.Link href="https://bureauroffa.com/about-prozadisplay">
          Proza Display
        </Modal.Link>
        , both designed by{" "}
        <Modal.Link href="https://bureauroffa.com/">Bureau Roffa</Modal.Link>.
      </Modal.Paragraph>
    </Modal>
  );
}
