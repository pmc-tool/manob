"use client";

import { Modal } from "antd";

interface CertificationModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CertificationModal({ open, onClose }: CertificationModalProps) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Certification"
      footer={null}
      centered
      width={700}
    >
      <div className="space-y-4 text-gray-700">
        <p>
          Under penalties of perjury, I declare that I have examined the
          information on this form and to the best of my knowledge and belief it
          is true, correct, and complete. I further certify under penalties of
          perjury that:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            I am the individual that is the beneficial owner (or am authorized
            to sign for the individual that is the beneficial owner) of all the
            income to which this form relates or am using this form to document
            myself for chapter 4 purposes;
          </li>
          <li>The person named on line 1 of this form is not a U.S. person;</li>
          <li>
            The income to which this form relates is:
            <ol className="list-decimal pl-6 mt-2 space-y-2">
              <li>
                not effectively connected with the conduct of a trade or
                business in the United States;
              </li>
              <li>
                effectively connected but is not subject to tax under an
                applicable income tax treaty; or
              </li>
              <li>
                the partner&apos;s share of a partnership&apos;s effectively connected
                income;
              </li>
            </ol>
          </li>
          <li>
            The person named on line 1 of this form is a resident of the treaty
            country listed on line 9 of the form (if any) within the meaning of
            the income tax treaty between the United States and that country;
            and
          </li>
          <li>
            For broker transactions or barter exchanges; the beneficial owner is
            an exempt foreign person as defined in the instructions.
          </li>
        </ul>
        <p>
          Furthermore, I authorize this form to be provided to any withholding
          agent that has control, receipt, or custody of the income of which I
          am the beneficial owner or any withholding agent that can disburse or
          make payments of the income of which I am the beneficial owner. I
          agree that I will submit a new form within 30 days if any
          certification made on this form becomes incorrect.
        </p>
        <p className="font-semibold">
          The Internal Revenue Service does not require your consent to any
          provisions of this document other than the certifications required to
          establish your status as a non-U.S. individual and, if applicable,
          obtain a reduced rate of withholding.
        </p>
      </div>
    </Modal>
  );
}
