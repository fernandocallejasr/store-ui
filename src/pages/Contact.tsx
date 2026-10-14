import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import PageHeading from "../components/PageHeading";
import Container from "../components/common/Container";

interface ContactLink {
	label: string;
	handle: string;
	href: string;
	icon: IconDefinition;
}

const contactLinks: ContactLink[] = [
	{
		label: "GitHub",
		handle: "github.com/fernandocallejasr",
		href: "https://github.com/fernandocallejasr",
		icon: faGithub,
	},
	{
		label: "LinkedIn",
		handle: "linkedin.com/in/fernando-callejas",
		href: "https://www.linkedin.com/in/fernando-callejas/",
		icon: faLinkedin,
	},
];

const Contact = () => {
	return (
		<Container className="pb-16">
			<PageHeading title="Contact">
				<p>
					Have a question or just want to say hi? Reach out through any of
					the channels below.
				</p>
			</PageHeading>

			<ul className="max-w-xl divide-y divide-slate-200 overflow-hidden rounded-xl bg-white dark:divide-slate-600 dark:bg-slate-700">
				{contactLinks.map(({ label, handle, href, icon }) => (
					<li key={label}>
						<a
							href={href}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-4 px-6 py-5 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary dark:hover:bg-slate-600"
						>
							<FontAwesomeIcon
								icon={icon}
								className="h-6 w-6 text-slate-900 dark:text-slate-200"
								aria-hidden="true"
							/>
							<span className="min-w-0 flex-1">
								<span className="block font-medium text-slate-900 dark:text-slate-200">{label}</span>
								<span className="block truncate text-sm text-slate-600 dark:text-slate-300">{handle}</span>
							</span>
							<FontAwesomeIcon
								icon={faArrowUpRightFromSquare}
								className="h-4 w-4 text-slate-500 dark:text-slate-300"
								aria-hidden="true"
							/>
							<span className="sr-only">(opens in new tab)</span>
						</a>
					</li>
				))}
			</ul>
		</Container>
	);
};

export default Contact;
