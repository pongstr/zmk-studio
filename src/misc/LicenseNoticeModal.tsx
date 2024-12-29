import { FC, PropsWithChildren, useState } from "react";
import NOTICE from "/NOTICE?raw";
import { Modal, ModalContent } from "@/components/modal/Modal";

export const LicenseNoticeModal: FC<PropsWithChildren> = ({ children }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <a
        role="button"
        className="hover:cursor-pointer hover:text-primary"
        onClick={() => setOpen(true)}
      >
        {children}
      </a>
      <Modal open={open} onOpenChange={setOpen}>
        <ModalContent className="w-9/12 md:max-w-3xl">
          <div className="flex items-start justify-between">
            <p className="mr-2">
              ZMK Studio is released under the open source Apache 2.0 license. A
              copy of the NOTICE file from the ZMK Studio repository is included
              here:
            </p>
          </div>
          <pre className="w-full overflow-auto rounded-lg border border-base-300 bg-base-200 p-3 font-mono text-xs">
            {NOTICE}
          </pre>
        </ModalContent>
      </Modal>
    </>
  );
};
