import { Button, Tooltip } from "antd";
import { motion, useAnimation } from "framer-motion";
import {
  ArrowUpRight,
  BetweenHorizontalEnd,
  Blocks,
  BriefcaseBusiness,
  Building,
  Check,
  History,
  Info,
  LifeBuoy,
  Mail,
  MailCheck,
  MoveUpRight,
  Rocket,
  UserRound,
  UserRoundCheck,
} from "lucide-react";
import React, { useEffect } from "react";

export default function Pricing() {
  const text = "Save up to 20% today!";
  const svgControls = useAnimation();
  const textControls = useAnimation();

  useEffect(() => {
    async function sequence() {
      while (true) {
        // Animate SVG path
        await svgControls.start({
          pathLength: 1,
          transition: { duration: 2.5, ease: "easeInOut" },
        });

        // Animate text
        await textControls.start("visible");

        // Keep SVG and text visible for 3 seconds (pause)
        await new Promise((res) => setTimeout(res, 3000));

        // Reset both SVG and text for the next loop
        svgControls.set({ pathLength: 0 });
        textControls.set("hidden");
      }
    }

    sequence();
  }, [svgControls, textControls]);

  const leftFeatures = [
    { icon: UserRound, label: "Developer Seats", labelText: "prompt text" },
    { icon: LifeBuoy, label: "Updates Time", labelText: "prompt text" },
    { icon: Blocks, label: "Blocks & Components", labelText: "prompt text" },
    {
      icon: BetweenHorizontalEnd,
      label: "Sectoral Template",
      labelText: "prompt text",
    },
    { icon: Mail, label: "Communication Methods", labelText: "prompt text" },
    { icon: History, label: "Support Response", labelText: "prompt text" },
    {
      icon: BriefcaseBusiness,
      label: "Commercial Usage",
      labelText: "prompt text",
    },
  ];

  const personalFeatures = [
    "Single user license",
    "Life-time",
    "Includes all blocks",
    "Included all templates",
    "Email address",
    "24 hours",
    "Use in unlimited projects",
  ];

  const startupFeatures = [
    "5-user license",
    "Life-time",
    "Includes all blocks",
    "Included all templates",
    "Discord",
    "24 hours",
    "Use in unlimited projects",
  ];
  const enterpriseFeatures = [
    "Custom user license",
    "Life-time",
    "Includes all blocks",
    "Included all templates",
    "Private Slack channel",
    "12 hours",
    "Use in unlimited projects",
  ];

  return (
    <>
      <div className="border-b border-gray-200  pb-4 mb-4">
        <h3 className="text-lg font-semibold">Plans & Credits</h3>
        <div className="text-gray-600">
          Billing, usage, and credits information...
        </div>
      </div>
      <h1 className="mt-3 text-[34px] font-semibold -tracking-[0.02em] text-gray-900 md:mt-4 md:text-center">
        Get everything, forever.
      </h1>

      <p className="mt-1 max-w-xl text-gray-600 md:px-2 text-center text-[18px] m-auto">
        <span className="font-medium text-gray-800">One-time</span> {/* */}
        payment grants you{/* */}{" "}
        <span className="font-medium text-gray-800">lifetime access</span>{" "}
        {/* */}
        and{/* */}{" "}
        <span className="font-medium text-gray-800">continuous updates</span>,
        with
        {/* */} <span className="font-medium text-gray-800">unlimited</span>{" "}
        {/* */}projects.
      </p>

      <div className="relative -mx-4 w-auto pt-20 md:mx-0 md:w-full xl:pt-16">
        <div className="w-full rounded-4xl bg-gray-50 p-1 pb-0 ring-1 ring-inset ring-gray-200 md:p-2.5">
          <div className="grid grid-cols-[minmax(187px,1fr),minmax(0,1fr)] rounded-[28px] bg-gray-100 p-1 shadow md:gap-2 md:rounded-3xl md:p-2 xl:grid-cols-4">
            <div className="relative flex flex-col gap-3 px-2.5 py-7 before:absolute before:inset-y-0 before:right-0 before:w-px before:bg-gray-200 min-[480px]:pl-4 min-[480px]:pr-4 md:pl-3 md:pr-4">
              <motion.div
                className="absolute -top-18 left-[95px] whitespace-nowrap font-kalam text-[20px]/[24px] -tracking-[0.01em] text-primary"
                initial="hidden"
                animate={textControls}
                variants={{
                  hidden: {},
                  visible: {
                    transition: { staggerChildren: 0.05 },
                  },
                }}
              >
                {text.split("").map((char, i) => (
                  <motion.span
                    key={i}
                    variants={{
                      hidden: { opacity: 0, y: 8 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          type: "spring",
                          stiffness: 200,
                          damping: 18,
                        },
                      },
                    }}
                    style={{ display: "inline-block" }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </motion.div>
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                width={74}
                height={66}
                fill="none"
                viewBox="0 0 74 66"
                className="absolute -top-[39px] left-[75px]"
              >
                <motion.path
                  d="M1 65  C8.216 60.786 14.135 55.827 17.788 49.387 C20.38 44.817 21.832 39.503 21.798 33.18 C21.77 28.052 18.841 21.427 13.852 27.926 C9.252 33.918 11.836 45.036 17.788 49.387 L17.923 49.485 C27 55.907 37.406 49.542 43.869 42.187 C53.868 30.807 65.018 15.475 71.594 1.707 C71.594 1.707 59.533 7.857 59.533 7.857 C64.007 6.543 67.398 4.28 71.242 1.701 C74.009 -0.156 72.853 1.99 72.159 4.488 C71.029 8.548 70.855 13.998 72.243 18.042"
                  stroke="#F05023"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeDasharray={1}
                  initial={{ pathLength: 0 }}
                  animate={svgControls}
                />
              </motion.svg>

              <div className="flex w-full flex-col items-start pb-2 min-h-62 md:px-2">
                <button
                  type="button"
                  role="switch"
                  aria-checked="false"
                  data-state="unchecked"
                  value="on"
                  className="group relative h-6 w-[46px] shrink-0 rounded-full bg-gray-200 transition duration-200 ease-nc data-[state=checked]:bg-orange"
                >
                  <span
                    data-state="unchecked"
                    className="price-switch-thumb absolute left-0.5 top-0.5 flex size-5 items-center justify-center rounded-full bg-gray-100 data-[state=checked]:translate-x-[22px]"
                  >
                    <div className="size-1.5 rounded-full bg-gray-200 group-data-[state=checked]:bg-orange" />
                  </span>
                </button>
                <div className="mt-5">
                  <div className="font-medium text-[16px] text-primary">
                    Get the full package!
                  </div>
                  <div className="mt-1 text-[18px]/[26px] font-medium text-gray-900">
                    Include the Figma file to save time on your projects!
                  </div>
                </div>
                <Button
                  block
                  className="mt-auto shrink-0"
                  icon={<MoveUpRight size={13} />}
                  iconPlacement="end"
                >
                  Learn more
                </Button>
              </div>
              <div className="relative h-0 w-full">
                <div className="absolute left-0 top-0 h-px w-full bg-gray-200" />
              </div>
              {leftFeatures.map((item, index) => (
                <React.Fragment key={index}>
                  {index > 0 && (
                    <div className="relative h-0 w-full">
                      <div className="absolute left-0 top-0 h-px w-full bg-gray-200" />
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <item.icon size={18} className="shrink-0 text-primary" />
                    <div className="flex items-center gap-1">
                      <span className="text-gray-800">{item.label}</span>
                      <Tooltip title={item.labelText}>
                        <Info size={13} className="shrink-0 text-gray-500" />
                      </Tooltip>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
            <div className="flex-col gap-3 px-2.5 py-7 min-[480px]:px-4 md:px-4 xl:flex flex duration-300 animate-in fade-in-0 xl:animate-none">
              <div className="flex w-full flex-col items-start pb-2 max-[768px]:h-72">
                <UserRoundCheck className="shrink-0 text-primary" />
                <div className="mt-4">
                  <div className="text-lg font-medium text-gray-900">
                    Personal
                  </div>
                  <div className="mt-1 text-gray-600">
                    Perfect for freelancers and indie developers.
                  </div>
                </div>
                <div className="my-6 flex flex-col items-start">
                  <div className="items-center gap-2 flex">
                    <div className="text-[28px] font-semibold text-gray-800">
                      $299
                    </div>
                    <div>
                      <div className="text-[13px]/[16px] font-medium -tracking-[0.006em] text-gray-700">
                        one-time payment
                      </div>
                      <div className="mt-1 text-[13px]/[16px] -tracking-[0.006em] text-gray-500">
                        plus local taxes
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  block
                  className="shrink-0"
                  icon={<MoveUpRight size={13} />}
                  iconPlacement="end"
                >
                  {" "}
                  Buy now
                </Button>
              </div>
              <div className="relative h-0 w-full">
                <div className="absolute left-0 top-0 h-px w-full bg-gray-200" />
              </div>
              {personalFeatures.map((text, index) => (
                <React.Fragment key={index}>
                  {index > 0 && (
                    <div className="relative h-0 w-full">
                      <div className="absolute left-0 top-0 h-px w-full bg-gray-200" />
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Check size={13} className="text-primary shrink-0" />
                    <span className="text-gray-800">{text}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
            <div className="relative hidden flex-col gap-3 rounded-20 bg-gray-900 px-2.5 py-7 shadow-button-gray min-[480px]:px-4 md:rounded-2xl md:px-4 xl:flex">
              <div className="absolute right-3 top-3 flex h-5 items-center rounded-[5px] bg-primary px-[7px] text-[11px] text-white">
                MOST POPULAR
              </div>
              <div className="flex w-full flex-col items-start pb-2 min-h-62">
                <Rocket className="shrink-0 text-primary" />
                <div className="mt-4">
                  <div className="text-lg font-medium text-gray-50">
                    Startups
                  </div>
                  <div className="mt-1 text-gray-400">
                    Ideal for small teams and growing companies.
                  </div>
                </div>
                <div className="my-6 flex flex-col items-start">
                  <div className="items-center gap-2 flex">
                    <div className="text-[28px] font-semibold text-gray-50">
                      $399
                    </div>
                    <div>
                      <div className="text-[13px]/[16px] font-medium -tracking-[0.006em] text-gray-400">
                        one-time payment
                      </div>
                      <div className="mt-1 text-[13px]/[16px] -tracking-[0.006em] text-gray-600">
                        plus local taxes
                      </div>
                    </div>
                  </div>
                </div>
                <Button block type="primary" className="shrink-0">
                  {" "}
                  Buy now
                </Button>
              </div>
              <div className="relative h-0 w-full">
                <div className="absolute left-0 top-0 h-px w-full bg-gray-800" />
              </div>
              {startupFeatures.map((text, index) => (
                <React.Fragment key={index}>
                  {index > 0 && (
                    <div className="relative h-0 w-full">
                      <div className="absolute left-0 top-0 h-px w-full bg-gray-800" />
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Check size={13} className="text-primary shrink-0" />
                    <span className="text-label-xs text-gray-300 sm:text-label-sm">
                      {text}
                    </span>
                  </div>
                </React.Fragment>
              ))}
            </div>
            <div className="hidden flex-col gap-3 px-2.5 py-7 min-[480px]:px-4 md:px-4 xl:flex">
              <div className="flex w-full flex-col items-start pb-2 min-h-62">
                <Building className="shrink-0 text-primary" />
                <div className="mt-4">
                  <div className="text-lg font-medium text-gray-900">
                    Enterprise
                  </div>
                  <div className="mt-1 text-gray-600">
                    Best for enterprises with unique challenges.
                  </div>
                </div>
                <Button
                  block
                  icon={<MailCheck size={15} />}
                  className="mt-auto shrink-0"
                  iconPlacement="end"
                >
                  Contact us
                </Button>
              </div>
              <div className="relative h-0 w-full">
                <div className="absolute left-0 top-0 h-px w-full bg-gray-200" />
              </div>
              {enterpriseFeatures.map((text, index) => (
                <React.Fragment key={index}>
                  {index > 0 && (
                    <div className="relative h-0 w-full">
                      <div className="absolute left-0 top-0 h-px w-full bg-gray-200" />
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Check size={13} className="text-primary shrink-0" />
                    <span className="text-gray-800">{text}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2.5 px-2 py-5 sm:gap-4 sm:py-6 xl:px-3.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-orange/[.08] text-primary sm:size-11">
              <Info />
            </div>
            <div>
              <div className="text-lg text-gray-800">
                We value PPP and offer discounts.
              </div>
              <p className=" text-gray-600">
                Verify your eligibility with a student ID, license, or similar
                proof by contacting us at{" "}
                <a
                  href="mailto:support@packmycode.com"
                  className="font-medium text-primary"
                >
                  support@packmycode.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
