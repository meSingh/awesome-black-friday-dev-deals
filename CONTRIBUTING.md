# Contributing

## Adding a deal

Each deal is one file in [`deals/`](deals), named after the product: `deals/acme-cli.yml`. There are two ways to add yours:

- **A pull request** that adds the file. This is the recommended way: you are listed as a contributor once it is merged.
- **The [Submit a deal](https://github.com/meSingh/awesome-black-friday-dev-deals/issues/new?template=submit-deal.yml) form.** You fill in the same details and the file is written for you.

The quick way: use the **[Add your deal](README.md#add-your-deal)** link in the README. GitHub opens a new file with the lines already laid out. Rename it, fill it in, click **Commit changes**, then **Create pull request**. If you do not have write access, GitHub forks the list for you first.

```yaml
name: Acme CLI
url: https://acme.dev/black-friday
category: Developer tools
discount: 40% off annual plans
code: BF26
starts: 2026-11-27
ends: 2026-12-02
description: A command line tool that deploys containers to your own servers
image:
logo:
relation: I built it
```

- One pull request, one new file, nothing else changed.
- The file name is lowercase letters, digits and dashes, ending in `.yml`.
- Each value stays on its own line. Leave `code`, `image` and `logo` empty if you have none.
- `relation` is one of: `I built it`, `I use it`, `No relation`.

Please do not edit `README.md` or `data/site.json`: both are written from the files in `deals/`.

## The rules

A deal is listed when all of these hold:

- **It is a real Black Friday 2026 deal** on a product a developer would use, stated on the page you link to.
- **The link is the seller's own https page.** Link shorteners and affiliate networks are refused. Referral and tracking parameters (`ref`, `via`, `aff`, `utm_*` and similar) are removed from the stored link.
- **The dates are real.** Start and end in `YYYY-MM-DD`. The end date can be left empty if the deal has none. The deal has not ended, it is running at some point in the Black Friday sale weeks, and it lasts no longer than 60 days. Deals that started early or run on into December are welcome.
- **The discount is specific.** "40% off annual plans" or "$50 off", in 60 characters or fewer. A percentage must be between 1 and 100.
- **The description is plain.** One sentence on what the product is, 160 characters or fewer, no sales copy.
- **A logo helps, and is optional.** A link to your product's logo or app icon: square, at least 128 pixels wide, png, jpg or webp. If you leave it empty, the icon your site declares is used.
- **The image is yours, and optional.** A link to your own banner or social image: png, jpg or webp, up to 5 MB. If you leave it empty, the social image from your page is used. It sits next to your deal on [dev.express](https://dev.express/black-friday/). The site keeps its own copy, so your server is not hit on every visit.
- **It is not already listed.**

Never listed: general retail (clothing, watches, beauty, household goods), gambling, adult content, crypto and get-rich schemes. The list is for software and tools that developers, founders and AI builders use.

## What the reply means

| Reply | Meaning | What to do |
|---|---|---|
| "is live" | The deal is in the README and on dev.express. A pull request is merged; a form issue is closed | Nothing. A star or a share is welcome; your listing stays either way |
| "nearly there" | A line is missing or malformed | Edit your file in the pull request (Files changed, the three dots, Edit file), or edit your issue if you used the form; it gets looked at again by itself |
| "nearly in" | Everything looks right, but the link would not open automatically | Nothing; the maintainer opens the page and lists it |
| "not one for this list" | The deal breaks a rule | Reply there if you think we got it wrong |

## Changing a deal that is already listed

Open a pull request that edits the deal's file in `deals/`. A change to a deal that is already listed is looked at by the maintainer, not merged automatically.

## Changing the code

```bash
npm test          # the review rules
npm run build     # regenerate the README tables and data/site.json
```

`data/site.json` is the same list as plain data. The website at [dev.express/black-friday](https://dev.express/black-friday/) reads it.
