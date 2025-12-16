// Job Post Page - Create a new job posting
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Input,
  InputNumber,
  Select,
  Button,
  message,
  Radio,
  Switch
} from "antd";
import {
  Briefcase,
  DollarSign,
  Clock,
  Award,
  Tags,
  FileText,
  ArrowLeft,
  Zap
} from "lucide-react";
import { mockSkills } from "@/lib/mocks/job-list.mock";
import styles from "./JobPost.module.css";

const { TextArea } = Input;

const experienceLevels = [
  { value: "Entry", label: "Entry Level" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Expert", label: "Expert" },
];

const deliveryTimeTypes = [
  { value: "Days", label: "Days" },
  { value: "Weeks", label: "Weeks" },
  { value: "Months", label: "Months" },
];

export default function JobPostPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: 100,
    deliveryTime: 7,
    deliveryTimeType: "Days",
    experienceLevel: "Intermediate",
    jobType: "REGULAR" as "REGULAR" | "LIVE",
    skills: [] as string[],
    isLiveJob: false,
    liveDuration: 3,
  });

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      message.error("Please enter a job title");
      return;
    }
    if (!formData.description.trim()) {
      message.error("Please enter a job description");
      return;
    }
    if (formData.skills.length === 0) {
      message.error("Please select at least one skill");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    message.success("Job posted successfully!");
    setIsSubmitting(false);
    router.push("/job-list");
  };

  const handleSkillChange = (values: string[]) => {
    setFormData(prev => ({ ...prev, skills: values }));
  };

  const handleJobTypeChange = (isLive: boolean) => {
    setFormData(prev => ({
      ...prev,
      isLiveJob: isLive,
      jobType: isLive ? "LIVE" : "REGULAR"
    }));
  };

  return (
    <div className={styles.jobPostPage}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderInner}>
          <button className={styles.backBtn} onClick={() => router.back()}>
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <div className={styles.headerContent}>
            <h1 className={styles.pageTitle}>Post a New Job</h1>
            <p className={styles.pageSubtitle}>
              Fill in the details below to create your job posting
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className={styles.formContainer}>
        <div className={styles.formCard}>
          {/* Job Title */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              <Briefcase size={18} />
              <span>Job Title</span>
            </label>
            <Input
              size="large"
              placeholder="e.g., Build a React E-commerce Website"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className={styles.input}
            />
            <p className={styles.hint}>A clear, specific title attracts better candidates</p>
          </div>

          {/* Job Description */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              <FileText size={18} />
              <span>Job Description</span>
            </label>
            <TextArea
              rows={6}
              placeholder="Describe the project requirements, deliverables, and any specific skills needed..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className={styles.textarea}
            />
            <p className={styles.hint}>Include project scope, requirements, and expected deliverables</p>
          </div>

          {/* Budget & Delivery */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <DollarSign size={18} />
                <span>Budget (USD)</span>
              </label>
              <InputNumber
                size="large"
                min={10}
                max={100000}
                value={formData.budget}
                onChange={(value) => setFormData(prev => ({ ...prev, budget: value || 100 }))}
                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => Number(value?.replace(/\$\s?|(,*)/g, '') || 0)}
                style={{ width: '100%' }}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <Clock size={18} />
                <span>Delivery Time</span>
              </label>
              <div className={styles.deliveryRow}>
                <InputNumber
                  size="large"
                  min={1}
                  max={365}
                  value={formData.deliveryTime}
                  onChange={(value) => setFormData(prev => ({ ...prev, deliveryTime: value || 7 }))}
                  style={{ flex: 1 }}
                />
                <Select
                  size="large"
                  value={formData.deliveryTimeType}
                  onChange={(value) => setFormData(prev => ({ ...prev, deliveryTimeType: value }))}
                  options={deliveryTimeTypes}
                  style={{ width: 120 }}
                />
              </div>
            </div>
          </div>

          {/* Experience Level */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              <Award size={18} />
              <span>Experience Level</span>
            </label>
            <Radio.Group
              value={formData.experienceLevel}
              onChange={(e) => setFormData(prev => ({ ...prev, experienceLevel: e.target.value }))}
              className={styles.radioGroup}
            >
              {experienceLevels.map(level => (
                <Radio.Button key={level.value} value={level.value} className={styles.radioBtn}>
                  {level.label}
                </Radio.Button>
              ))}
            </Radio.Group>
          </div>

          {/* Skills */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              <Tags size={18} />
              <span>Required Skills</span>
            </label>
            <Select
              mode="multiple"
              size="large"
              placeholder="Select required skills"
              value={formData.skills}
              onChange={handleSkillChange}
              options={mockSkills.map(skill => ({ value: skill.id, label: skill.title }))}
              style={{ width: '100%' }}
              maxTagCount={5}
            />
            <p className={styles.hint}>Select up to 10 skills relevant to your job</p>
          </div>

          {/* Job Type Toggle */}
          <div className={styles.jobTypeSection}>
            <div className={styles.jobTypeHeader}>
              <div className={styles.jobTypeInfo}>
                <Zap size={20} className={styles.liveIcon} />
                <div>
                  <h3>Live Job</h3>
                  <p>Get faster responses with a time-limited posting</p>
                </div>
              </div>
              <Switch
                checked={formData.isLiveJob}
                onChange={handleJobTypeChange}
              />
            </div>

            {formData.isLiveJob && (
              <div className={styles.liveDuration}>
                <label>Live Duration</label>
                <Select
                  size="large"
                  value={formData.liveDuration}
                  onChange={(value) => setFormData(prev => ({ ...prev, liveDuration: value }))}
                  options={[
                    { value: 1, label: "1 Day" },
                    { value: 3, label: "3 Days" },
                    { value: 7, label: "7 Days" },
                  ]}
                  style={{ width: 150 }}
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className={styles.formActions}>
            <Button
              size="large"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              size="large"
              loading={isSubmitting}
              onClick={handleSubmit}
              className={styles.submitBtn}
            >
              {isSubmitting ? "Posting..." : "Post Job"}
            </Button>
          </div>
        </div>

        {/* Tips Sidebar */}
        <div className={styles.tipsSidebar}>
          <div className={styles.tipsCard}>
            <h3>Tips for a Great Job Post</h3>
            <ul>
              <li>
                <strong>Be specific</strong> - Clearly describe the project scope and requirements
              </li>
              <li>
                <strong>Set realistic budget</strong> - Research market rates for similar projects
              </li>
              <li>
                <strong>List required skills</strong> - Help freelancers understand if they're a good fit
              </li>
              <li>
                <strong>Include deliverables</strong> - Specify what you expect to receive
              </li>
              <li>
                <strong>Set clear timeline</strong> - Be realistic about your delivery expectations
              </li>
            </ul>
          </div>

          <div className={styles.statsCard}>
            <h3>Platform Stats</h3>
            <div className={styles.stat}>
              <span className={styles.statValue}>2,500+</span>
              <span className={styles.statLabel}>Active Freelancers</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>24hrs</span>
              <span className={styles.statLabel}>Avg. First Response</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>95%</span>
              <span className={styles.statLabel}>Job Completion Rate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
