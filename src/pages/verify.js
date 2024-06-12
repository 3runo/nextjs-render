import "@onefootprint/footprint-js/dist/footprint-js.css";
import { useRouter } from "next/router";
import React from "react";
import footprint from "@onefootprint/footprint-js";

const fallbackPKey = "pb_live_1TFF0tCgMqyqEfUK15xBZT";

const isString = (x) => typeof x === "string" && !!x;
const isValidTokenFormat = (str) => Boolean(str) && /tok_/.test(str);
const getSdkArgsToken = (str) => (isValidTokenFormat(str) ? str : "");

function getQueryArgs(router) {
	const { query, asPath } = router;
	const {
		app_url: appUrl,
		locale = "en-US",
		ob_key: obKey,
		user_data: rawUserData,
	} = query;
	let userData = {};

	try {
		userData = isString(rawUserData)
			? JSON.parse(decodeURIComponent(rawUserData))
			: {};
	} catch (_) {
		// do nothing
	}

	return {
		appUrl: String(appUrl),
		authToken: getSdkArgsToken(asPath.split("#")[1]) ?? "",
		locale,
		publicKey: isString(obKey) ? obKey : fallbackPKey,
		userData,
	};
}

export default function Verify() {
	const router = useRouter();
	const { appUrl, locale, publicKey, userData } = getQueryArgs(router);

	function onButtonClick() {
		const component = footprint.init({
			kind: "verify",
			variant: "modal",
			onAuth: (s) => console.log("onAuth", s),
			onCancel: () => console.log("onCancel"),
			onClose: () => console.log("onClose"),
			onComplete: (s) => console.log("onComplete", s),
			l10n: { locale },
			options: { showLogo: false },
			publicKey,
			userData,
		});
		component.render(appUrl);

		return () => {
			component.destroy();
		};
	}

	return (
		<div>
			<button type="button" onClick={onButtonClick}>
				Verify with Footprint
			</button>
		</div>
	);
}
