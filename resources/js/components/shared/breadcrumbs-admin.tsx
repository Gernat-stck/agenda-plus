import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import type { BreadcrumbItem as BreadcrumbItemType } from "@/types"
import { Link, usePage } from "@inertiajs/react"
import { Fragment } from "react"

export function Breadcrumbs({ breadcrumbs }: { breadcrumbs: BreadcrumbItemType[] }) {
    // Get the current URL path
    const { url } = usePage()

    // Extract all segments of the current URL path
    const currentPathSegments = url.split("/").filter(Boolean)

    // Find the index of the current segment in the breadcrumbs array
    const currentIndex = breadcrumbs.findIndex((item) => {
        const itemSegment = item.href.split("/").filter(Boolean).pop() || ""
        return (
            currentPathSegments.includes(itemSegment) && currentPathSegments[currentPathSegments.length - 1] === itemSegment
        )
    })

    return (
        <>
            {breadcrumbs.length > 0 && (
                <Breadcrumb>
                    <BreadcrumbList>
                        {breadcrumbs.map((item, index) => {
                            // Extract the last segment of the breadcrumb href
                            const itemSegment = item.href.split("/").filter(Boolean).pop() || ""

                            // Check if this breadcrumb item corresponds to the current URL segment
                            const isCurrentPath =
                                currentPathSegments.includes(itemSegment) &&
                                currentPathSegments[currentPathSegments.length - 1] === itemSegment

                            return (
                                <Fragment key={index}>
                                    <BreadcrumbItem>
                                        {isCurrentPath ? (
                                            <BreadcrumbPage>{item.title}</BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink asChild>
                                                <Link href={item.href}>{item.title}</Link>
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                    {index < breadcrumbs.length - 1 && (
                                        <BreadcrumbSeparator>{index < currentIndex ? ">" : "-"}</BreadcrumbSeparator>
                                    )}
                                </Fragment>
                            )
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            )}
        </>
    )
}

