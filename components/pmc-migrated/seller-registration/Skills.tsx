"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSellerWizard } from "@/context/SellerWizardContext";
import { Skill } from "@/lib/mocks/seller.mock";
import styles from "./SellerRegistration.module.css";

interface SkillsProps {
  skills: Skill[];
}

export default function Skills({ skills }: SkillsProps) {
  const router = useRouter();
  const { prevStep, selectedSkills, setSelectedSkills, resetWizard } = useSellerWizard();
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [customSkills, setCustomSkills] = useState<{ id: number; skill_name: string }[]>(
    selectedSkills
  );

  const handleStartSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (customSkills.length === 0) {
      toast.error("Please select at least one skill");
      return;
    }

    try {
      setIsSaving(true);

      // Save skills to context
      setSelectedSkills(customSkills);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success message
      setSuccessMessage(true);
      toast.success("Seller profile created successfully!");

      // Redirect after 5 seconds
      setTimeout(() => {
        resetWizard();
        router.push("/marketplace");
      }, 5000);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again.");
      setIsSaving(false);
    }
  };

  const toggleSkill = (skill: Skill) => {
    const exists = customSkills.some((s) => s.id === skill.id);
    if (exists) {
      setCustomSkills(customSkills.filter((s) => s.id !== skill.id));
    } else {
      setCustomSkills([
        ...customSkills,
        {
          id: skill.id,
          skill_name: skill.skill_name || skill.name,
        },
      ]);
    }
  };

  return (
    <form onSubmit={handleStartSetup}>
      <div className={`container ${styles.formContent}`}>
        <div className="mb-4">
          <h2 className="fw-bold">Add Skill To Reach Client</h2>
          <p className="text-muted">Showcase your skills to build trust and reach more clients.</p>
        </div>
        {successMessage && (
          <div className={styles.successMessage}>
            <div className={`${styles.successIcon} mb-3`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="72px"
                height="72px"
              >
                <g fill="none" stroke="#1dbf73" strokeWidth="2">
                  <circle
                    cx="36"
                    cy="36"
                    r="35"
                    style={{
                      strokeDasharray: "240px, 240px",
                      strokeDashoffset: "480px",
                    }}
                  ></circle>
                  <path
                    d="M17.417,37.778l9.93,9.909l25.444-25.393"
                    style={{
                      strokeDasharray: "50px, 50px",
                      strokeDashoffset: "50px",
                    }}
                  ></path>
                </g>
              </svg>
            </div>
            <h3 className="mb-1" style={{ fontSize: "26px" }}>
              Your seller profile has been
              <br className="d-none d-lg-block" /> created successfully!
            </h3>
            <div className="text-muted">
              Your account is ready — you&apos;ll be redirected to your seller
              <br className="d-none d-lg-block" /> dashboard in 5 seconds.
            </div>
          </div>
        )}
        {!successMessage && (
          <>
            <div className="mb-2 text-danger fw-semibold">
              Select minimum 1 skill
            </div>
            <div className="border rounded p-3 mb-3">
              <div className="d-flex flex-wrap gap-2 mb-2">
                {customSkills.length === 0 ? (
                  <span className="text-muted" style={{ fontSize: "14px" }}>
                    No skills selected yet. Click on skills below to add them.
                  </span>
                ) : (
                  customSkills.map((skill) => (
                    <span
                      key={skill.id}
                      className="badge bg-primary d-flex align-items-center text-capitalize"
                      style={{ padding: "0.5rem" }}
                    >
                      {skill.skill_name}
                      <button
                        type="button"
                        className="btn-close btn-close-white btn-sm ms-2"
                        onClick={() =>
                          setCustomSkills(
                            customSkills.filter((s) => s.id !== skill.id)
                          )
                        }
                        style={{ fontSize: "0.6rem" }}
                      ></button>
                    </span>
                  ))
                )}
              </div>
            </div>
            <div className="row g-2 mb-3">
              {skills.map((skill) => {
                const isActive = customSkills.some((s) => s.id === skill.id);
                return (
                  <div
                    key={skill.id}
                    className="col-6 col-sm-4 col-md-3 col-lg-2"
                  >
                    <button
                      type="button"
                      className={`btn w-100 border ${
                        isActive ? "btn-primary text-white" : "btn-light"
                      }`}
                      onClick={() => toggleSkill(skill)}
                      style={{ fontSize: "13px" }}
                    >
                      {skill.name}
                    </button>
                  </div>
                );
              })}
            </div>
            <div className={`d-flex gap-2 ${styles.btnContainer}`}>
              <button
                type="button"
                onClick={prevStep}
                className={styles.btnDark}
              >
                Back
              </button>
              <button
                type="submit"
                className={styles.btnThm}
                disabled={isSaving}
              >
                {isSaving ? "Publishing..." : "Publish"}
              </button>
            </div>
          </>
        )}
      </div>
    </form>
  );
}
