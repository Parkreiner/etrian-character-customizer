import Modal from "../Modal";

export default function CreditsButton() {
  return (
    <Modal
      buttonText="Credits"
      modalTitle="Credits"
      modalDescription="Special thanks and misc. notes"
    >
      <Modal.Subsection title="Special thanks">
        <Modal.List>
          <Modal.ListItem>
            Big thanks to Josh Comeau&apos;s Discord community for his learning
            platform (particularly{" "}
            <Modal.Link href="https://www.joshwcomeau.com/">
              Josh himself
            </Modal.Link>{" "}
            and{" "}
            <Modal.Link href="https://bonnie.dev/">Bonnie Schulkin</Modal.Link>
            ), for helping me really solidify my mental models for React and
            CSS, and being so willing to help out with any bugs I ran into.
          </Modal.ListItem>

          <Modal.ListItem>
            Also incredibly grateful to the Etrian Oddyssey Data Mining and
            Coding community on Discord (private community) for humoring all my
            weird, annoying Unity asset quesions.
          </Modal.ListItem>
        </Modal.List>
      </Modal.Subsection>

      <Modal.Subsection title="Colophon">
        <Modal.Paragraph>
          Typeset in{" "}
          <Modal.Link href="https://fonts.google.com/specimen/Proza+Libre">
            Proza Libre (free via Google Fonts)
          </Modal.Link>{" "}
          and{" "}
          <Modal.Link href="https://bureauroffa.com/about-prozadisplay">
            Proza Display (licensed)
          </Modal.Link>
          , both designed by{" "}
          <Modal.Link href="https://bureauroffa.com/">Bureau Roffa</Modal.Link>.
        </Modal.Paragraph>
      </Modal.Subsection>

      <Modal.Subsection title="Other links">
        <Modal.List>
          <Modal.ListItem>
            <Modal.Link href="https://github.com/Parkreiner">
              My GitHub
            </Modal.Link>
          </Modal.ListItem>

          <Modal.ListItem>
            <Modal.Link href="https://www.linkedin.com/in/michael-eric-smith/">
              My LinkedIn
            </Modal.Link>
          </Modal.ListItem>
        </Modal.List>
      </Modal.Subsection>
    </Modal>
  );
}
